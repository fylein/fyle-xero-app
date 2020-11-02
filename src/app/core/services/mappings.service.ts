import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  // TODO: Map models to each of these and the methods below

  fyleCategories: Observable<any[]>;
  netsuiteAccounts: Observable<any[]>;
  fyleEmployees: Observable<any[]>;
  netsuiteVendors: Observable<any[]>;
  netsuiteEmployees: Observable<any[]>;
  fyleProjects: Observable<any[]>;
  fyleExpenseCustomFields: Observable<any[]>;
  xeroTrackingCategories: Observable<any[]>;
  netsuiteDepartments: Observable<any[]>;
  fyleCostCenters: Observable<any[]>;
  netsuiteLocations: Observable<any[]>;
  netsuiteClasses: Observable<any[]>;
  netsuiteCategories: Observable<any[]>;
  netsuiteCurrencies: Observable<any[]>;
  generalMappings: Observable<any[]>;
  accountPayables: Observable<any[]>;
  netsuiteSubsidiaries: Observable<any[]>;
  xeroAccounts: Observable<any[]>;
  expenseFields: Observable<any[]>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  postFyleEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleEmployees) {
      this.fyleEmployees = this.apiService.post(`/workspaces/${workspaceId}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  postFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCategories) {
      this.fyleCategories = this.apiService.post(`/workspaces/${workspaceId}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleProjects) {
      this.fyleProjects = this.apiService.post(`/workspaces/${workspaceId}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.apiService.post(`/workspaces/${workspaceId}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postExpenseCustomFields() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleExpenseCustomFields) {
      this.fyleExpenseCustomFields = this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleExpenseCustomFields;
  }

  postXeroTrackingCategories(sync: boolean = false) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.xeroTrackingCategories || sync) {
      this.xeroTrackingCategories = this.apiService.post(`/workspaces/${workspaceId}/xero/tracking_categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroTrackingCategories;
  }

  postNetsuiteCustomSegments(data: any) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_segments/`, data);
  }

  postNetSuiteVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteVendors) {
      this.netsuiteVendors = this.apiService.post(`/workspaces/${workspaceId}/netsuite/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteVendors;
  }

  postNetSuiteCurrencies() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteCurrencies) {
      this.netsuiteCurrencies = this.apiService.post(`/workspaces/${workspaceId}/netsuite/currencies/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteCurrencies;
  }

  postNetSuiteExpenseCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteCategories) {
      this.netsuiteCategories = this.apiService.post(`/workspaces/${workspaceId}/netsuite/expense_categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteCategories;
  }

  postNetSuiteEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteEmployees) {
      this.netsuiteEmployees = this.apiService.post(`/workspaces/${workspaceId}/netsuite/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteEmployees;
  }

  postNetSuiteAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteAccounts) {
      this.netsuiteAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/netsuite/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteAccounts;
  }

  postNetSuiteClasses() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteClasses) {
      this.netsuiteClasses = this.apiService.post(`/workspaces/${workspaceId}/netsuite/classifications/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteClasses;
  }

  postNetSuiteDepartments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteDepartments) {
      this.netsuiteDepartments = this.apiService.post(`/workspaces/${workspaceId}/netsuite/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteDepartments;
  }

  postNetSuiteLocations() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteLocations) {
      this.netsuiteLocations = this.apiService.post(`/workspaces/${workspaceId}/netsuite/locations/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteLocations;
  }


  postXeroTenants() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteSubsidiaries) {
      this.netsuiteSubsidiaries = this.apiService.post(`/workspaces/${workspaceId}/xero/tenants/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteSubsidiaries;
  }

  postXeroAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.xeroAccounts) {
      this.xeroAccounts = this.apiService.post(`/workspaces/${workspaceId}/xero/accounts/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroAccounts;
  }


  getFyleEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleExpenseFields() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getNetSuiteVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/vendors/`, {});
  }

  getXeroFields() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/xero_fields/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseCustomFields(attributeType: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseSegments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_segments/`, {});
  }

  getNetSuiteEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/employees/`, {});
  }

  getNetSuiteLocations() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/locations/`, {});
  }

  getFyleProjects() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/projects/`, {});
  }

  getNetSuiteClasses() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/classifications/`, {});
  }

  getNetSuiteDepartments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/departments/`, {});
  }

  getFyleCostCenters() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts/`, {}
    );
  }

  getBankAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/xero/bank_accounts/`, {}
    );
  }

  getAccountsPayables() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/credit_card_accounts/`, {}
    );
  }

  getXeroTenants() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/tenants/`, {});
  }

  // TODO: Replace any with proper model
  postGeneralMappings(generalMappings: any) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }


  getTenantMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/tenant/`, {}
    );
  }

  getMappings(sourceType): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, {
        source_type: sourceType
      }
    );
  }

  postMappings(mapping: any) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  getCategoryMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/categories/`, {}
    );
  }

  getEmployeeMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employees/`, {}
    );
  }

  getProjectMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/projects/`, {}
    );
  }

  getCostCenterMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {}
    );
  }
}
