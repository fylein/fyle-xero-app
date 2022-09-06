import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { XeroComponent } from 'src/app/xero/xero.component';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { XeroCredentials } from 'src/app/core/models/xero-credentials.model';
import { TrackingService } from 'src/app/core/services/tracking.service';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../../xero.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading = true;
  showAutoCreate: boolean;
  showAutoCreateMerchantDestinationEntity: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  cccExpenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  windowReference: Window;
  xeroCompanyCountry: string;
  isChartOfAccountsEnabled: boolean;
  allAccountTypes: { label: string, value: string }[];

  constructor(private formBuilder: FormBuilder, private storageService: StorageService, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private xero: XeroComponent, private windowReferenceService: WindowReferenceService, private trackingService: TrackingService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  getAllSettings() {
    const that = this;
    forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).subscribe(responses => {
      that.generalSettings = responses[0];
      that.mappingSettings = responses[1].results;

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_xero_payments) {
        paymentsSyncOption = 'sync_fyle_to_xero_payments';
      } else if (that.generalSettings.sync_xero_to_fyle_payments) {
        paymentsSyncOption = 'sync_xero_to_fyle_payments';
      }
      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        paymentsSync: [paymentsSyncOption],
        changeAccountingPeriod: [that.generalSettings.change_accounting_period],
        importCategories: [that.generalSettings.import_categories],
        importCustomers: [that.generalSettings.import_customers],
        autoMapEmployees: [that.generalSettings.auto_map_employees],
        autoCreateDestinationEntity: [that.generalSettings.auto_create_destination_entity],
        autoCreateMerchantDestinationEntity: [that.generalSettings.auto_create_merchant_destination_entity],
        importTaxCodes: [that.generalSettings.import_tax_codes ? that.generalSettings.import_tax_codes : false],
        chartOfAccounts: [that.generalSettings.charts_of_accounts ? that.generalSettings.charts_of_accounts : ['EXPENSE']],
      });

      that.showAutoCreateOption(that.generalSettings.auto_map_employees);
      that.showAutoCreateMerchantDestinationEntityOption(that.generalSettings.corporate_credit_card_expenses_object);
      that.showChartOfAccounts(that.generalSettings.import_categories);
      that.generalSettingsForm.controls.reimbursableExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      if (that.xeroCompanyCountry === 'US') {
        that.generalSettingsForm.controls.importTaxCodes.disable();
      }

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference);
      });

      that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((corporateCreditCardObject) => {
        that.showAutoCreateMerchantDestinationEntityOption(corporateCreditCardObject);
      });

      that.isLoading = false;
    }, error => {
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        paymentsSync: [null],
        changeAccountingPeriod: [false],
        importCategories: [false],
        importCustomers: [false],
        autoMapEmployees: [null],
        autoCreateDestinationEntity: [false],
        autoCreateMerchantDestinationEntity: [false],
        importTaxCodes: [false],
        chartOfAccounts: [['EXPENSE']]
      });

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference);
      });

      that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((corporateCreditCardObject) => {
        that.showAutoCreateMerchantDestinationEntityOption(corporateCreditCardObject);
      });
    });
  }

  showChartOfAccounts(importCategories: boolean) {
    const that = this;
    if (importCategories) {
      that.isChartOfAccountsEnabled = true;
    } else {
      that.isChartOfAccountsEnabled = false;
    }
  }

  save() {
    const that = this;
    const mappingsSettingsPayload: MappingSetting[] = [
      {
        source_field: 'CATEGORY',
        destination_field: 'ACCOUNT'
      },
      {
        source_field: 'EMPLOYEE',
        destination_field: 'CONTACT'
      }, {
        source_field: 'CORPORATE_CARD',
        destination_field: 'BANK_ACCOUNT'
      }
    ];

    const reimbursableExpensesObject = that.generalSettingsForm.value.reimbursableExpense || (that.generalSettings ? that.generalSettings.reimbursable_expenses_object : null);
    const cccExpensesObject = that.generalSettingsForm.value.cccExpense || (that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : null);
    const importCategories = that.generalSettingsForm.value.importCategories;
    const importCustomers = that.generalSettingsForm.value.importCustomers;
    const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;
    const autoCreateDestinationEntity = that.generalSettingsForm.value.autoCreateDestinationEntity;
    const autoCreateMerchantDestinationEntity = that.generalSettingsForm.value.autoCreateMerchantDestinationEntity;
    const importTaxCodes = that.generalSettingsForm.value.importTaxCodes ? that.generalSettingsForm.value.importTaxCodes : false;
    const chartOfAccounts = importCategories ? that.generalSettingsForm.value.chartOfAccounts : ['EXPENSE'];
    const changeAccountingPeriod =  that.generalSettingsForm.value.changeAccountingPeriod ? that.generalSettingsForm.value.changeAccountingPeriod : false;

    let fyleToXero = false;
    let xeroToFyle = false;

    if (that.generalSettingsForm.controls.paymentsSync.value) {
      fyleToXero = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_xero_payments' ? true : false;
      xeroToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_xero_to_fyle_payments' ? true : false;
    }

    that.isLoading = true;

    if (importTaxCodes) {
      mappingsSettingsPayload.push({
        source_field: 'TAX_GROUP',
        destination_field: 'TAX_CODE'
      });
    }

    const generalSettingsPayload: GeneralSetting = {
      reimbursable_expenses_object: reimbursableExpensesObject,
      corporate_credit_card_expenses_object: cccExpensesObject,
      sync_fyle_to_xero_payments: fyleToXero,
      sync_xero_to_fyle_payments: xeroToFyle,
      change_accounting_period: changeAccountingPeriod,
      import_categories: importCategories,
      import_tax_codes: importTaxCodes,
      auto_map_employees: autoMapEmployees,
      auto_create_destination_entity: autoCreateDestinationEntity,
      auto_create_merchant_destination_entity: autoCreateMerchantDestinationEntity,
      charts_of_accounts: chartOfAccounts,
      import_customers: importCustomers
    };

    forkJoin(
      [
        that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
        that.settingsService.postGeneralSettings(that.workspaceId, generalSettingsPayload)
      ]
    ).subscribe(responses => {
      that.isLoading = true;
      that.storageService.set('generalSettings', responses[1]);
      that.snackBar.open('Configuration saved successfully');

      if (autoMapEmployees) {
        setTimeout(() => {
          that.snackBar.open('Auto mapping of employees may take few minutes');
        }, 1500);
      }

      if (importTaxCodes) {
        const trackingProperties = {
          import_tax_codes_enabled: importTaxCodes
        };

        that.trackingService.onImportingTaxGroups(trackingProperties);
      }

      that.xero.getSettingsAndNavigate();

      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);

    });
  }

  showAutoCreateOption(autoMapEmployees) {
    const that = this;
    if (autoMapEmployees && autoMapEmployees !== 'EMPLOYEE_CODE') {
      that.showAutoCreate = true;
    } else {
      that.showAutoCreate = false;
      that.generalSettingsForm.controls.autoCreateDestinationEntity.setValue(false);
    }
  }

  showAutoCreateMerchantDestinationEntityOption(corporateCreditCardExpensesObject) {
    const that = this;
    if (corporateCreditCardExpensesObject) {
      that.showAutoCreateMerchantDestinationEntity = true;
    } else {
      that.showAutoCreateMerchantDestinationEntity = false;
      that.generalSettingsForm.controls.autoCreateMerchantDestinationEntity.setValue(false);
    }
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.settingsService.getXeroCredentials(that.workspaceId).subscribe((xeroCredentials: XeroCredentials) => {
      that.xeroCompanyCountry = xeroCredentials.country;
      that.allAccountTypes = [
        {
          label: 'Expense',
          value: 'EXPENSE'
        },
        {
          label: 'Asset',
          value: 'ASSET'
        },
        {
          label: 'Equity',
          value: 'EQUITY'
        },
        {
          label: 'Liability',
          value: 'LIABILITY'
        },
        {
          label: 'Revenue',
          value: 'REVENUE'
        }
      ];
      that.getAllSettings();
    });
  }

}
