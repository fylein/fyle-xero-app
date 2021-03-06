import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

    if (that.form.valid) {
      const bankAccountId = that.form.value.bankAccounts || '';
      const bankAccount: MappingDestination = that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] || null;

      const paymentAccountId = that.generalSettings.sync_fyle_to_xero_payments ? that.form.value.paymentAccounts : '';
      const paymentAccount: MappingDestination = that.generalSettings.sync_fyle_to_xero_payments ? that.paymentAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === paymentAccountId)[0] : null;

      const generalMappings = {
        bank_account_name: bankAccount ? bankAccount.value : null,
        bank_account_id: bankAccount ? bankAccount.destination_id : null,
        payment_account_name: paymentAccount ? paymentAccount.value : null,
        payment_account_id: paymentAccount ? paymentAccount.destination_id : null
      };
      that.isLoading = true;
      this.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded === true) {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      }, error => {
        that.snackBar.open('Please fill up the form with valid values');
        that.form.markAllAsTouched();
      });
    } else {
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    }
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings().subscribe(generalMappings => {
      that.generalMappings = generalMappings;
      that.isLoading = false;

      that.form = that.formBuilder.group({
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : '', that.generalSettings.corporate_credit_card_expenses_object ? Validators.required : ''],
        paymentAccounts: [that.generalMappings ? that.generalMappings.payment_account_id : '', that.generalSettings.sync_fyle_to_xero_payments ? Validators.required : '']
      });
    }, error => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        bankAccounts: [null, that.generalSettings.corporate_credit_card_expenses_object ? Validators.required : null],
        paymentAccounts: [null, that.generalSettings.sync_fyle_to_xero_payments ? Validators.required : null]
      });
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getBankAccounts()
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      that.paymentAccounts = responses[0];
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
