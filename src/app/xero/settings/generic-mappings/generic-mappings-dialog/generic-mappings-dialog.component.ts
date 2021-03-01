import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { MappingSource } from 'src/app/core/models/mapping-source.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { MappingModal } from 'src/app/core/models/mapping-modal.model';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-generic-mappings-dialog',
  templateUrl: './generic-mappings-dialog.component.html',
  styleUrls: ['./generic-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class GenericMappingsDialogComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  fyleAttributes: MappingSource[];
  xeroElements: MappingDestination[];
  xeroOptions: MappingDestination[];
  fyleAttributeOptions: MappingSource[];
  setting: MappingSetting;
  editMapping: boolean;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<GenericMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MappingModal,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings({
        source_type: that.setting.source_field,
        destination_type: that.setting.destination_field,
        source_value: that.form.controls.sourceField.value.value,
        destination_value: that.form.controls.destinationField.value.value,
        destination_id: that.form.controls.destinationField.value.destination_id
      }).subscribe(response => {
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

  forbiddenSelectionValidator(options: (MappingSource|MappingDestination)[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: object } | null => {
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

  setupSourceFieldAutocompleteWatcher() {
    const that = this;

    that.form.controls.sourceField.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.fyleAttributeOptions = that.fyleAttributes
          .filter(fyleAttribute => new RegExp(newValue.toLowerCase(), 'g').test(fyleAttribute.value.toLowerCase()));
      }
    });
  }

  setupDestinationFieldAutocompleteWatcher() {
    const that = this;

    that.form.controls.destinationField.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.xeroOptions = that.xeroElements
          .filter(xeroElement => new RegExp(newValue.toLowerCase(), 'g').test(xeroElement.value.toLowerCase()));
      }
    });
  }

  setupAutcompleteWathcers() {
    const that = this;
    that.setupSourceFieldAutocompleteWatcher();
    that.setupDestinationFieldAutocompleteWatcher();
  }

  reset() {
    const that = this;
    that.isLoading = true;

    forkJoin([
      that.mappingsService.getFyleExpenseCustomFields(that.setting.source_field),
      that.mappingsService.getXeroTrackingCategories(that.setting.destination_field)
    ]).subscribe(response => {
      that.isLoading = false;

      that.fyleAttributes = response[0];
      that.xeroElements = response[1];

      const sourceField = that.editMapping ? that.fyleAttributes.filter(field => field.value === that.data.rowElement.source.value)[0] : '';
      const destinationField = that.editMapping ? that.xeroElements.filter(field => field.value === that.data.rowElement.destination.value)[0] : '';

      that.form = that.formBuilder.group({
        sourceField: [sourceField, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleAttributes)])],
        destinationField: [destinationField, that.forbiddenSelectionValidator(that.xeroElements)],
      });

      if (that.editMapping) {
        that.form.controls.sourceField.disable();
      }

      that.setupAutcompleteWathcers();
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;

    if (that.data.rowElement) {
      that.editMapping = true;
    }

    that.setting = that.data.setting;

    that.isLoading = false;
    that.reset();
  }

}
