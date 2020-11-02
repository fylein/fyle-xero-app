import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-employee-mappings-dialog',
  templateUrl: './employee-mappings-dialog.component.html',
  styleUrls: ['./employee-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class EmployeeMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  workSpaceId: number;
  // TODO: replace any with relevant models
  fyleEmployees: any[];
  netsuiteEmployees: any[];
  cccObjects: any[];
  netsuiteVendors: any[];
  generalSettings: any;
  employeeOptions: any[];
  xeroContactOptions: any[];
  cccOptions: any[];
  netsuiteVendorOptions: any[];
  generalMappings: any;
  editMapping: boolean;

  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeMappingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mappingsService: MappingsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService) { }


  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    const fyleEmployee = that.form.controls.fyleEmployee.value;
    const xeroContact = that.form.controls.xeroContact.value;

    if (that.form.valid && xeroContact) {
      const employeeMapping = [
        that.mappingsService.postMappings({
          source_type: 'EMPLOYEE',
          destination_type: 'CONTACT',
          source_value: fyleEmployee.value,
          destination_value: xeroContact.value
        })
      ];

      that.isLoading = true;
      forkJoin(employeeMapping).subscribe(responses => {
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

  forbiddenSelectionValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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

  setupFyleEmployeeAutocompleteWatcher() {
    const that = this;
    that.form.controls.fyleEmployee.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.employeeOptions = that.fyleEmployees
          .filter(fyleEmployee => new RegExp(newValue.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase()));
      }
    });
  }

  setupnetsuiteEmployeesWatcher() {
    const that = this;

    that.form.controls.xeroContact.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.xeroContactOptions = that.netsuiteEmployees
          .filter(xeroContact => new RegExp(newValue.toLowerCase(), 'g').test(xeroContact.value.toLowerCase()));
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleEmployeeAutocompleteWatcher();
    that.setupnetsuiteEmployeesWatcher();
  }

  reset() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    const getFyleEmployees = that.mappingsService.getFyleEmployees().toPromise().then((fyleEmployees) => {
      that.fyleEmployees = fyleEmployees;
    });
    // TODO: remove promises and do with rxjs observables
    const getnetsuiteEmployees = that.mappingsService.getXeroContacts().toPromise().then((netsuiteEmployees) => {
      that.netsuiteEmployees = netsuiteEmployees;
    });

    that.isLoading = true;
    forkJoin([
      from(getFyleEmployees),
      from(getnetsuiteEmployees)
    ]).subscribe((res) => {
      const fyleEmployee = that.editMapping ? that.fyleEmployees.filter(employee => employee.value === that.data.rowElement.fyle_value)[0] : '';
      const xeroContact = that.editMapping ? that.netsuiteEmployees.filter(employee => employee.value === that.data.rowElement.netsuite_value)[0] : '';
      that.isLoading = false;
      that.form = that.formBuilder.group({
        fyleEmployee: [that.editMapping ? fyleEmployee : Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleEmployees)])],
        xeroContact: [that.generalSettings.employee_field_mapping === 'EMPLOYEE' && that.editMapping ? xeroContact : that.forbiddenSelectionValidator(that.netsuiteEmployees)],
      });

      if(that.editMapping) {
        that.form.controls.fyleEmployee.disable()
      }

      that.setupAutocompleteWatchers();
    });
  }

  ngOnInit() {
    const that = this;
    
    if (that.data.rowElement) {
      that.editMapping = true;
    }
    
    that.workSpaceId = that.data.workspaceId;
    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.workSpaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }

}
