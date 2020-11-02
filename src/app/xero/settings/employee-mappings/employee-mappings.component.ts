import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog/employee-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-employee-mappings',
  templateUrl: './employee-mappings.component.html',
  styleUrls: ['./employee-mappings.component.scss', '../settings.component.scss', '../../xero.component.scss']
})
export class EmployeeMappingsComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  employeeMappings: any[];
  workspaceId: number;
  isLoading = true;
  generalSettings: any;
  filteredAccounts: any[];
  rowElement: any;
  columnsToDisplay = ['employee_email', 'xero'];

  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private router: Router,
    private settingsService: SettingsService,
    private storageService: StorageService) {
  }

  open(selectedItem: any=null) {
    const that = this;
    const dialogRef = that.dialog.open(EmployeeMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        rowElement: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.isLoading = true;
      that.mappingsService.getMappings('EMPLOYEE').subscribe((employees) => {
        that.employeeMappings = employees.results;
        that.isLoading = false;
        const onboarded = that.storageService.get('onboarded');

        if (onboarded === true) {
          that.createEmployeeMappingsRows();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      });
    });
  }

  createEmployeeMappingsRows() {
    const that = this;
    const employeeEVMappings = that.employeeMappings.filter(mapping => mapping.destination_type !== 'CREDIT_CARD_ACCOUNT');
    const mappings = [];

    employeeEVMappings.forEach(employeeEVMapping => {
      mappings.push({
        fyle_value: employeeEVMapping.source.value,
        netsuite_value: employeeEVMapping.destination.value,
        ccc_account: that.getCCCAccount(that.employeeMappings, employeeEVMapping)
      });
    });
    that.employeeMappings = mappings;
  }

  getCCCAccount(employeeMappings, employeeEVMapping) {
    const empMapping = employeeMappings.filter(evMapping => evMapping.destination_type === 'CREDIT_CARD_ACCOUNT' && evMapping.source.value === employeeEVMapping.source.value);

    return empMapping.length ? empMapping[0].destination.value : null;
  }

  reset() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings('EMPLOYEE').subscribe((employees) => {
      that.employeeMappings = employees.results;
      that.createEmployeeMappingsRows();
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }
}
