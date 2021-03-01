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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../../xero.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  cccExpenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  windowReference: Window;

  constructor(private formBuilder: FormBuilder, private storageService: StorageService, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private xero: XeroComponent, private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  getAllSettings() {
    const that = this;
    that.isLoading = true;
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
        importCategories: [that.generalSettings.import_categories],
        autoMapEmployees: [that.generalSettings.auto_map_employees]
      });

      that.generalSettingsForm.controls.reimbursableExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      that.isLoading = false;
    }, error => {
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        paymentsSync: [null],
        importCategories: [false],
        autoMapEmployees: [null]
      }, {
      });
    });
  }

  save() {
    const that = this;
    if (that.generalSettingsForm.valid) {
      const mappingsSettingsPayload: MappingSetting[] = [
        {
          source_field: 'CATEGORY',
          destination_field: 'ACCOUNT'
        },
        {
          source_field: 'EMPLOYEE',
          destination_field: 'CONTACT'
        }
      ];

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimbursableExpense || (that.generalSettings ? that.generalSettings.reimbursable_expenses_object : null);
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || (that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : null);
      const importCategories = that.generalSettingsForm.value.importCategories;
      const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;

      let fyleToXero = false;
      let xeroToFyle = false;

      if (that.generalSettingsForm.controls.paymentsSync.value) {
        fyleToXero = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_xero_payments' ? true : false;
        xeroToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_xero_to_fyle_payments' ? true : false;
      }

      that.isLoading = true;

      forkJoin(
        [
          that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
          that.settingsService.postGeneralSettings(that.workspaceId, reimbursableExpensesObject, cccExpensesObject, fyleToXero, xeroToFyle, importCategories, autoMapEmployees)
        ]
      ).subscribe(responses => {
        that.isLoading = true;
        that.storageService.set('generalSettings', responses[1]);
        that.snackBar.open('Configuration saved successfully');

        if (autoMapEmployees) {
          setTimeout(() => {
            that.snackBar.open('Auto mapping of employees may take up to 10 minutes');
          }, 1500);
        }

        that.xero.getSettingsAndNavigate();
        if (that.generalSettings && that.generalSettings.reimbursable_expenses_object) {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`).then(() => {
            that.windowReference.location.reload();
          });
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.generalSettingsForm.markAllAsTouched();
    }
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.getAllSettings();
  }

}
