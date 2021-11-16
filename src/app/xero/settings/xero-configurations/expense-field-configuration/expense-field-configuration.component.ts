import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { forkJoin } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { XeroComponent } from 'src/app/xero/xero.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { ExpenseField } from 'src/app/core/models/expense-field.model';

@Component({
  selector: 'app-expense-field-configuration',
  templateUrl: './expense-field-configuration.component.html',
  styleUrls: ['./expense-field-configuration.component.scss', '../../../xero.component.scss']
})
export class ExpenseFieldConfigurationComponent implements OnInit {
  expenseFieldsForm: FormGroup;
  expenseFields: FormArray;
  workspaceId: number;
  isLoading: boolean;
  mappingSettings: MappingSetting[];
  fyleExpenseFields: ExpenseField[];
  xeroFields: ExpenseField[];
  fyleFormFieldList: ExpenseField[];
  xeroFormFieldList: ExpenseField[];
  windowReference: Window;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private mappingsService: MappingsService, private xero: XeroComponent, private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
   }

  createExpenseField(sourceField: string = '', destinationField: string = '') {
    const that = this;

    const group = that.formBuilder.group({
      source_field: [sourceField ? sourceField : '', [Validators.required, RxwebValidators.unique()]],
      destination_field: [destinationField ? destinationField : '', [Validators.required, RxwebValidators.unique()]],
    });

    if (sourceField && destinationField) {
      group.disable();
    }
    return group;
  }

  showAddButton() {
    const that = this;
    const expenseFieldCount = that.expenseFieldsForm.controls.expenseFields.value.length;
    if (expenseFieldCount === Math.min(that.fyleExpenseFields.length, that.xeroFields.length) || (expenseFieldCount > 2)) {
      return false;
    }
    return true;
  }

  addExpenseField() {
    const that = this;

    that.expenseFields = that.expenseFieldsForm.get('expenseFields') as FormArray;
    that.expenseFields.push(that.createExpenseField());
  }

  saveExpenseFields() {
    const that = this;

    that.isLoading = true;
    const expenseFields: MappingSetting[] = that.expenseFieldsForm.value.expenseFields;

    that.settingsService.postMappingSettings(that.workspaceId, expenseFields).subscribe(response => {
      that.xero.getGeneralSettings();
      that.router.navigateByUrl(`/workspaces/${that.workspaceId}/dashboard`);
      that.isLoading = false;
    });
  }

  removeExpenseField(index: number) {
    const that = this;

    const expenseFields = that.expenseFieldsForm.get('expenseFields') as FormArray;
    expenseFields.removeAt(index);
  }

  getSettings() {
    const that = this;
    forkJoin(
      [
        that.settingsService.getMappingSettings(that.workspaceId),
        that.mappingsService.getFyleExpenseFields(),
        that.mappingsService.getXeroFields()
      ]
    ).subscribe(response => {
      that.mappingSettings = response[0].results.filter(
        setting => setting.source_field !== 'EMPLOYEE' && setting.source_field !== 'CATEGORY' && setting.source_field !== 'CORPORATE_CARD'
      );

      let expenseFieldFormArray;

      that.fyleExpenseFields = response[1];
      that.xeroFields = response[2];

      that.fyleFormFieldList = response[1];
      that.xeroFormFieldList = response[2];

      if (that.mappingSettings.length) {
        expenseFieldFormArray = that.mappingSettings.map(
          setting => that.createExpenseField(setting.source_field, setting.destination_field)
        );
      } else {
        expenseFieldFormArray = [that.createExpenseField()];
      }

      that.expenseFieldsForm = that.formBuilder.group({
        expenseFields: that.formBuilder.array(expenseFieldFormArray)
      });

      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;

    that.isLoading = true;

    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;

    that.getSettings();
  }
}
