import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {} from '../../../xero.component'

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss', '../../../xero.component.scss']
})
export class TenantComponent implements OnInit {

  tenantForm: FormGroup;
  workspaceId: number;
  xeroTenants: any[]
  isLoading = true;
  tenantMappings: any;
  tenantMappingDone: boolean;

  constructor(private formBuilder: FormBuilder, 
              private settingsService: SettingsService, 
              private mappingsService: MappingsService, 
              private route: ActivatedRoute, 
              private router: Router, 
              private matselect: MatSelectModule,
              private snackBar: MatSnackBar) {
                this.tenantForm = this.formBuilder.group({
                  xeroTenant: new FormControl('')
              });
  }

  submit() {
    const tenantId = this.tenantForm.value.xeroTenant;
    const xeroTenant = this.xeroTenants.filter(filteredSubsidiary => filteredSubsidiary.destination_id === tenantId)[0];

    if (tenantId){
      this.isLoading = true;
      this.settingsService.postTenantMappings(this.workspaceId, xeroTenant.value, xeroTenant.destination_id).subscribe(response => {
        this.isLoading = false;
        this.router.navigateByUrl(`workspaces/${this.workspaceId}/dashboard`);
      });
    }
  }

  getTenantMappings() {
    const that = this;
    that.mappingsService.getTenantMappings().subscribe(tenantMappings => {
      console.log(tenantMappings)
      that.tenantMappings = tenantMappings;
      console.log(that.tenantMappings.tenant_name)

      that.tenantForm = that.formBuilder.group({
        xeroTenant: ['alksdh']
      });
      that.tenantForm.controls.xeroTenant.disable();
      that.tenantMappingDone = true;

      that.mappingsService.getXeroTenants().subscribe(tenants => {
        that.xeroTenants = tenants;
        console.log('tenants',tenants)
        this.isLoading = false;
      });
    }, error => {
      this.isLoading = false;
      that.tenantForm = that.formBuilder.group({
        xeroTenant: ['']
      });
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;
    that.mappingsService.postXeroTenants().subscribe(tenants => {
      that.xeroTenants = tenants; 
    });
    that.getTenantMappings();
  }

}
