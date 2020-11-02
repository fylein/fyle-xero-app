import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { XeroComponent } from 'src/app/xero/xero.component';

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
  generalSettings: any;
  mappingSettings: any;
  employeeFieldMapping: any;
  projectFieldMapping: any;
  costCenterFieldMapping: any;

  constructor(private formBuilder: FormBuilder, private storageService: StorageService, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private xero: XeroComponent) { }

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

      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
      });

      that.generalSettingsForm.controls.reimbursableExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.isSaveDisabled = true;
      }

      that.isLoading = false;
    }, error => {
      that.generalSettings = {};
      that.mappingSettings = {};
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null]
      }, {
      });
    });
  }

  save() {
    const that = this;
    if (that.generalSettingsForm.valid) {
      const mappingsSettingsPayload = [
        {
          source_field: 'CATEGORY',
          destination_field: 'ACCOUNT'
        },
        {
          source_field: 'EMPLOYEE',
          destination_field: 'CONTACT'
        }
      ];

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimbursableExpense || that.generalSettings.reimbursable_expenses_object;
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || that.generalSettings.corporate_credit_card_expenses_object;

      that.isLoading = true;

      forkJoin(
        [
          that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
          that.settingsService.postGeneralSettings(that.workspaceId, reimbursableExpensesObject, cccExpensesObject)
        ]
      ).subscribe(responses => {
        that.isLoading = true;
        that.storageService.set('generalSettings', responses[1])
        that.snackBar.open('Configuration saved successfully');
        that.xero.getGeneralSettings();
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
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