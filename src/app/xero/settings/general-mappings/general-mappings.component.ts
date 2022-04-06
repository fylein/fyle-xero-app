import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../xero.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  bankAccounts: MappingDestination[];
  paymentAccounts: MappingDestination[];
  generalMappings: GeneralMapping;
  generalSettings: GeneralSetting;
  taxCodes: MappingDestination[];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private storageService: StorageService) {
  }

  submit() {
    const that = this;
    const bankAccountId = that.form.value.bankAccounts || '';
    const bankAccount: MappingDestination = that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] || null;

    const paymentAccountId = that.generalSettings.sync_fyle_to_xero_payments ? that.form.value.paymentAccounts : '';
    const paymentAccount: MappingDestination = that.generalSettings.sync_fyle_to_xero_payments ? that.paymentAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === paymentAccountId)[0] : null;

    const defaultTaxCodeId = that.generalSettings.import_tax_codes ? that.form.value.xeroTaxCodes : null;
    const defaultTaxCode: MappingDestination = that.generalSettings.import_tax_codes ? that.taxCodes.filter(filteredTaxCode => filteredTaxCode.destination_id === defaultTaxCodeId)[0] : null;

    const generalMappings = {
      bank_account_name: bankAccount ? bankAccount.value : null,
      bank_account_id: bankAccount ? bankAccount.destination_id : null,
      payment_account_name: paymentAccount ? paymentAccount.value : null,
      payment_account_id: paymentAccount ? paymentAccount.destination_id : null,
      default_tax_code_name: defaultTaxCode ? defaultTaxCode.value : null,
      default_tax_code_id: defaultTaxCode ? defaultTaxCode.destination_id : null
    };
    that.isLoading = true;
    this.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
      const onboarded = that.storageService.get('onboarded');
      if (onboarded) {
        that.getGeneralMappings();
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    }, error => {
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    });
  }

  isFieldMandatory(controlName: string) {
    const abstractControl = this.form.controls[controlName];
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings().subscribe(generalMappings => {
      that.generalMappings = generalMappings;

      that.form = that.formBuilder.group({
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : '', that.generalSettings.corporate_credit_card_expenses_object ? Validators.required : ''],
        paymentAccounts: [that.generalMappings ? that.generalMappings.payment_account_id : '', that.generalSettings.sync_fyle_to_xero_payments ? Validators.required : ''],
        xeroTaxCodes: [that.generalMappings ? that.generalMappings.default_tax_code_id : '', that.generalSettings.import_tax_codes ? Validators.required : ''],
      });
      that.isLoading = false;
    }, () => {
      that.form = that.formBuilder.group({
        bankAccounts: [null, that.generalSettings.corporate_credit_card_expenses_object ? Validators.required : null],
        paymentAccounts: [null, that.generalSettings.sync_fyle_to_xero_payments ? Validators.required : null],
        xeroTaxCodes: [null, that.generalSettings.import_tax_codes ? Validators.required : null],
      });
      that.isLoading = false;
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getBankAccounts(),
        that.mappingsService.getXeroTaxCodes()
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      that.paymentAccounts = responses[0];
      that.taxCodes = responses[1];
      that.getGeneralMappings();
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getGeneralSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
