import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss', '../../../xero.component.scss']
})
export class TenantComponent implements OnInit {

  tenantForm: FormGroup;
  workspaceId: number;
  xeroTenants: any[];
  isLoading = true;
  tenantMappings: any;
  tenantMappingDone: boolean;

  constructor(private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private mappingsService: MappingsService,
              private route: ActivatedRoute,
              private router: Router) { }

  submit() {
    const tenantId = this.tenantForm.value.xeroTenant;
    const xeroTenant = this.xeroTenants.filter(filteredTenant => filteredTenant.destination_id === tenantId)[0];

    if (tenantId) {
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
      that.tenantMappings = tenantMappings;

      that.tenantForm = that.formBuilder.group({
        xeroTenant: [that.tenantMappings.tenant_id]
      });
      that.tenantForm.controls.xeroTenant.disable();
      that.tenantMappingDone = true;
      this.isLoading = false;
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
    that.mappingsService.getXeroTenants().subscribe(tenants => {
      that.xeroTenants = tenants;
      that.getTenantMappings();
    });
  }

}
