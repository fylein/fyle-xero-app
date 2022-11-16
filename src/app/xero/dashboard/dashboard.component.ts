import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { XeroComponent } from '../xero.component';
import { AppcuesService } from 'src/app/core/services/appcues.service';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const APP_URL = environment.app_url;

enum onboardingStates {
  initialized,
  fyleConnected,
  xeroConnected,
  tenantMappingDone,
  configurationsDone,
  generalMappingsDone,
  cardsMappingDone,
  employeeMappingsDone,
  categoryMappingsDone,
  isOnboarded
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../xero.component.scss']
})
export class DashboardComponent implements OnInit {
  workspaceId: number;
  isLoading: boolean;
  showGeneralmappings = true;
  showCardsMapping = true;
  generalSettings: GeneralSetting;

  currentState = onboardingStates.initialized;

  get allOnboardingStates() {
    return onboardingStates;
  }

  rippleDisabled = true;
  linearMode = true;

  successfulExpenseGroupsCount = 0;
  failedExpenseGroupsCount = 0;
  windowReference: Window;

  constructor(
    private appcuesService: AppcuesService,
    private expenseGroupService: ExpenseGroupsService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private mappingsService: MappingsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private xero: XeroComponent) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  connectFyle() {
    this.windowReference.location.href = `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  // TODO: remove promises and do with rxjs observables
  checkFyleLoginStatus() {
    const that = this;
    return that.settingsService.getFyleCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.fyleConnected;
      return credentials;
    });
  }

  // TODO: remove promises and do with rxjs observables
  getXeroStatus() {
    const that = this;
    return that.settingsService.getXeroCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.xeroConnected;
      return credentials;
    });
  }

  getTenantMappings() {
    const that = this;
    return that.mappingsService.getTenantMappings().toPromise().then(tenantMappings => {
      that.currentState = onboardingStates.tenantMappingDone;
      return tenantMappings;
    });
  }

  getConfigurations() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).toPromise().then(res => {
      that.generalSettings = res[0];
      that.currentState = onboardingStates.configurationsDone;
      if (!res[0].corporate_credit_card_expenses_object) {
        that.showCardsMapping = false;
        if (!res[0].sync_fyle_to_xero_payments) {
          that.showGeneralmappings = false;
        }
      }
      return res;
    });
  }

  getGeneralMappings() {
    const that = this;
    if (that.showGeneralmappings) {
      // TODO: remove promises and do with rxjs observables
      return that.mappingsService.getGeneralMappings().toPromise().then(generalMappings => {
        that.currentState = onboardingStates.generalMappingsDone;
        return generalMappings;
      });
    }
  }

  getCardsMappings() {
    const that = this;
    if (that.generalSettings && that.showCardsMapping) {
      if (that.generalSettings.skip_cards_mapping) {
        that.currentState = onboardingStates.cardsMappingDone;
      } else {
        return that.mappingsService.getMappings('CORPORATE_CARD', 1).toPromise().then((res) => {
          if (res.results.length > 0) {
            that.currentState = onboardingStates.cardsMappingDone;
          } else if (!that.generalSettings.corporate_credit_card_expenses_object) {
            that.currentState = onboardingStates.cardsMappingDone;
          } else if (!that.generalSettings.skip_cards_mapping) {
            throw new Error('card mappings have no entries');
          }
          return res;
        });
      }
    }
  }

  getEmployeeMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    if (that.generalSettings && that.generalSettings.auto_create_destination_entity) {
      that.currentState = onboardingStates.employeeMappingsDone;
      return;
    } else {
      return that.mappingsService.getMappings('EMPLOYEE', 1).toPromise().then((res) => {
        if (res.results.length > 0) {
          that.currentState = onboardingStates.employeeMappingsDone;
        } else {
          throw new Error('employee mappings have no entries');
        }
        return res;
      });
    }
  }

  getCategoryMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.mappingsService.getMappings('CATEGORY', 1).toPromise().then((res) => {
      if (res.results.length > 0) {
        that.currentState = onboardingStates.categoryMappingsDone;
      } else {
        throw new Error('cateogry mappings have no entries');
      }
      return res;
    });
  }

  loadSuccessfullExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getAllExpenseGroups('COMPLETE').toPromise().then((res) => {
      that.successfulExpenseGroupsCount = res.results.length;
      return res;
    });
  }

  loadFailedlExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getAllExpenseGroups('FAILED').toPromise().then((res) => {
      that.failedExpenseGroupsCount = res.results.length;
      return res;
    });
  }

  loadDashboardData() {
    const that = this;
    that.isLoading = true;
    // TODO: remove promises and do with rxjs observables
    return forkJoin([
      that.loadSuccessfullExpenseGroupsCount(),
      that.loadFailedlExpenseGroupsCount()
    ]).toPromise().then(() => {
      that.isLoading = false;
      return true;
    });
  }

  syncDimension() {
    const that = this;

    that.mappingsService.refreshFyleDimensions().subscribe(() => { });
    that.mappingsService.refreshXeroDimensions().subscribe(() => { });

    that.snackBar.open('Refreshing Fyle and Xero Data');
  }

  // to be callled in background whenever dashboard is opened for sncing fyle data for org
  updateDimensionTables() {
    const that = this;

    that.mappingsService.syncFyleDimensions().subscribe(() => { });
    that.mappingsService.syncXeroDimensions().subscribe(() => { });
  }

  openSchedule(event) {
    const that = this;
    event.preventDefault();
    this.windowReference.open(`workspaces/${that.workspaceId}/settings/schedule`, '_blank');
  }

  connectXero(onboarding: boolean = false) {
    this.windowReference.location.href = this.settingsService.generateXeroConnectionUrl(this.workspaceId);
    this.onConnectXeroPageVisit(onboarding);
  }

  onConnectXeroPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Connect Xero', onboarding);
  }

  onSelectTenantPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Select Tenant', onboarding);
  }

  onConfigurationsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Configurations', onboarding);
  }

  onGeneralMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('General Mappings', onboarding);
  }

  onCardsMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Cards Mappings', onboarding);
  }

  onEmployeeMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Employee Mappings', onboarding);
  }

  onCategoryMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Category Mappings', onboarding);
  }

  skipCardsMapping() {
    const that = this;
    if (that.showCardsMapping) {
      that.isLoading = true;
      that.settingsService.skipCardsMapping(that.workspaceId).subscribe((generalSetting: GeneralSetting) => {
        that.generalSettings = generalSetting;
        that.currentState = onboardingStates.cardsMappingDone;
        that.isLoading = false;
      });
    }
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    const onboarded = that.storageService.get('onboarded');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (window as any).Appcues && (window as any).Appcues.page();
      }
    });
    if (onboarded) {
      that.xero.showAppSwitcher();
      this.appcuesService.initialiseAppcues();
      that.updateDimensionTables();
      that.loadDashboardData();
      that.getXeroStatus().then(() => {
        that.currentState = onboardingStates.isOnboarded;
      }).catch(() => {
        that.storageService.set('onboarded', false);
        that.snackBar.open('Xero token expired, please connect Xero account again');
        setTimeout(() => {
          that.windowReference.location.reload();
        }, 3000);
      });
    } else {
      that.isLoading = true;
      that.checkFyleLoginStatus()
        .then(() => {
          return that.getXeroStatus();
        }).then(() => {
          return that.getTenantMappings();
        }).then(() => {
          that.updateDimensionTables();
          return that.getConfigurations();
        }).then(() => {
          return that.getGeneralMappings();
        }).then(() => {
          return that.getCardsMappings();
        }).then(() => {
          return that.getEmployeeMappings();
        }).then(() => {
          return that.getCategoryMappings();
        }).then(() => {
          that.currentState = onboardingStates.isOnboarded;
          that.storageService.set('onboarded', true);
          that.xero.showAppSwitcher();
          this.appcuesService.initialiseAppcues();
          that.xero.hideRefreshIconVisibility();
          return that.loadDashboardData();
        }).catch(() => {
          // do nothing as this just means some steps are left
          that.storageService.set('onboarded', false);
        }).finally(() => {
          that.isLoading = false;
        });
    }

  }

}
