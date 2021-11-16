import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { TenantMapping } from 'src/app/core/models/tenant-mapping.model';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss', '../../../xero.component.scss']
})
export class TenantComponent implements OnInit {

  tenantForm: FormGroup;
  workspaceId: number;
  xeroTenants: MappingDestination[];
  isLoading = true;
  tenantMappings: TenantMapping;
  connectedToXero: boolean;
  windowReference: Window;

  constructor(private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private mappingsService: MappingsService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private windowReferenceService: WindowReferenceService,
              private router: Router) {
                this.windowReference = this.windowReferenceService.nativeWindow;
              }

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

  connectToXero() {
    this.windowReference.location.href = this.settingsService.generateXeroConnectionUrl(this.workspaceId);
  }

  disconnectFromXero() {
    const that = this;
    that.isLoading = true;
    that.settingsService.revokeXeroConnection(that.workspaceId).subscribe(() => {
      that.snackBar.open('Successfully disconnected from Xero');
      that.connectedToXero = false;
      that.isLoading = false;
    });
  }

  getTenantMappings() {
    const that = this;
    that.mappingsService.getTenantMappings().subscribe(tenantMappings => {
      that.tenantMappings = tenantMappings;

      that.tenantForm = that.formBuilder.group({
        xeroTenant: [that.tenantMappings.tenant_id]
      });
      that.tenantForm.controls.xeroTenant.disable();
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
      that.settingsService.getXeroCredentials(that.workspaceId).subscribe(() => that.connectedToXero = true);
      that.getTenantMappings();
    });
  }

}
