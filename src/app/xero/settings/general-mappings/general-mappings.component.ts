import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../xero.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  bankAccounts: any[];
  generalMappings: any;
  generalSettings: any;
  isLoading: boolean = true;

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
    const bankAccount = that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] || '';

    const paymentAccountId = that.generalSettings.sync_fyle_to_xero_payments ? that.form.value.bankAccounts : '';
    const paymentAccount = that.generalSettings.sync_fyle_to_xero_payments ? that.bankAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === paymentAccountId)[0] : '';
  
    const generalMappings = {
      bank_account_name: bankAccount.value,
      bank_account_id: bankAccount.destination_id,
      payment_account_name: paymentAccount.value,
      payment_account_id: paymentAccount.destination_id
    };

    if (bankAccountId) {
      that.isLoading = true;
      this.mappingsService.postGeneralMappings(generalMappings).subscribe(response => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded === true) {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
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
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : ''],
        paymentAccounts: [that.generalMappings? that.generalMappings.payment_account_id: '']
      });
    }, error => {
      that.generalMappings = {};
      that.isLoading = false;
      that.form = that.formBuilder.group({
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : ''],
        paymentAccounts: [that.generalMappings? that.generalMappings.payment_account_id: '']
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
      that.getGeneralMappings();
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
