import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { SettingsService } from 'src/app/core/services/settings.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-category-mappings-dialog',
  templateUrl: './category-mappings-dialog.component.html',
  styleUrls: ['./category-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class CategoryMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleCategories: any[];
  netsuiteAccounts: any[];
  fyleCategoryOptions: any[];
  workspaceId: number;
  netsuiteAccountOptions: any[];
  netsuiteCCCAccountOptions: any[];
  generalSettings: any;
  cccAccounts: any[];
  editMapping: boolean;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CategoryMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar, private settingsService: SettingsService
              ) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  forbiddenSelectionValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !options.some((option) => {
        return control.value.id && option.id === control.value.id;
      });
      return forbidden ? {
        forbiddenOption: {
          value: control.value
        }
      } : null;
    };
  }

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      var mappings = [
        that.mappingsService.postMappings({
          source_type: 'CATEGORY',
          destination_type: 'ACCOUNT',
          source_value: that.form.controls.fyleCategory.value.value,
          destination_value: that.form.controls.netsuiteAccount.value.value
        })
      ]
      
      var destinationValue = that.form.controls.cccAccount.value.value;
      if (!that.form.value.cccAccount) {
        destinationValue = that.form.controls.netsuiteAccount.value.value;
      }
      mappings.push(that.mappingsService.postMappings({
        source_type: 'CATEGORY',
        destination_type: 'CCC_ACCOUNT',
        source_value: that.form.controls.fyleCategory.value.value,
        destination_value: destinationValue
      }))

      forkJoin(mappings).subscribe(response => {
        that.snackBar.open('Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, err => {
        that.snackBar.open('Something went wrong');
        that.isLoading = false;
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.form.markAllAsTouched();
    }
  }

  setupFyleCateogryWatchers() {
    const that = this;
    that.form.controls.fyleCategory.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.fyleCategoryOptions = that.fyleCategories
        .filter(fyleCategory => new RegExp(newValue.toLowerCase(), 'g').test(fyleCategory.value.toLowerCase()));
      }
    });
  }

  setupNetSuiteAccountWatchers() {
    const that = this;

    that.form.controls.netsuiteAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT') {
          newValue = `expense category - ${newValue.toLowerCase()}`
          that.netsuiteAccountOptions = that.netsuiteAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
        } else {
          that.netsuiteAccountOptions = that.netsuiteAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()) && netsuiteAccount.display_name !== 'Expense Category');
        }
      }
    });
  }

  showSeparateCCCField() {
    const that = this;
    if (that.generalSettings.corporate_credit_card_expenses_object) {
      if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' || that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT') {
        if (that.generalSettings.reimbursable_expenses_object !== that.generalSettings.corporate_credit_card_expenses_object) {
          return true;
        }
      }
    }
    return false;
  }

  setupNetSuiteCCCAccountWatchers() {
    const that = this;

    that.form.controls.cccAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        if (that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT') {
          newValue = `expense category - ${newValue.toLowerCase()}`
          that.netsuiteCCCAccountOptions = that.cccAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
        } else {
          that.netsuiteCCCAccountOptions = that.cccAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()) && netsuiteAccount.display_name !== 'Expense Category');
        }
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleCateogryWatchers();
    that.setupNetSuiteAccountWatchers();
    that.setupNetSuiteCCCAccountWatchers();
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.data.workspaceId;

    if (that.data.rowElement) {
      that.editMapping = true;
    }

    // TODO: remove promises and do with rxjs observables
    const getFyleCateogories = that.mappingsService.getFyleCategories().toPromise().then(fyleCategories => {
      that.fyleCategories = fyleCategories;
    });
    
    // TODO: remove promises and do with rxjs observables
    const getExpenseAccounts = that.mappingsService.getExpenseAccounts().toPromise().then(netsuiteAccounts => {
      that.netsuiteAccounts = netsuiteAccounts;
      that.cccAccounts = netsuiteAccounts;
    });

    const getGeneralSettings = that.settingsService.getGeneralSettings(this.workspaceId).toPromise().then(
      settings => that.generalSettings = settings
    );

    that.isLoading = true;
    forkJoin([
      getFyleCateogories,
      getExpenseAccounts,
      getGeneralSettings
    ]).subscribe(() => {
      that.isLoading = false;
      const fyleCategory = that.editMapping ? that.fyleCategories.filter(category => category.value === that.data.rowElement.fyle_value)[0] : '';
      const netsuiteAccount = that.editMapping ? that.netsuiteAccounts.filter(nsAccObj => nsAccObj.value === that.data.rowElement.netsuite_value)[0]: '';
      const cccAccount = that.editMapping ? that.cccAccounts.filter(cccObj => cccObj.value === that.data.rowElement.ccc_value)[0]: '';
      that.form = that.formBuilder.group({
        fyleCategory: [that.editMapping ? fyleCategory : Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCategories)])],
        netsuiteAccount: [this.editMapping ? netsuiteAccount : Validators.compose([that.forbiddenSelectionValidator(that.netsuiteAccounts)])],
        cccAccount: [cccAccount || '', that.showSeparateCCCField() ? that.forbiddenSelectionValidator(that.cccAccounts) : null]
      });

      if(that.editMapping) {
        that.form.controls.fyleCategory.disable()
      }
      
      that.setupAutocompleteWatchers();
    });
  }
}
