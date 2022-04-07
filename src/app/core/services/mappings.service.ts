import { Injectable } from '@angular/core';
import { empty, Observable, from, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { concatMap, expand, map, publishReplay, reduce, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { ExpenseField } from '../models/expense-field.model';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingDestination } from '../models/mapping-destination.model';
import { MappingSource } from '../models/mapping-source.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { Mapping } from '../models/mappings.model';
import { TenantMapping } from '../models/tenant-mapping.model';
import { WorkspaceService } from './workspace.service';

const generalMappingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  fyleCategories: Observable<MappingSource[]>;
  fyleEmployees: Observable<MappingSource[]>;
  fyleProjects: Observable<MappingSource[]>;
  fyleCostCenters: Observable<MappingSource[]>;
  fyleExpenseCustomFields: Observable<MappingSource[]>;
  destinationWorkspace: Observable<{}>;
  xeroContacts: Observable<MappingDestination[]>;
  xeroTrackingCategories: Observable<MappingDestination[]>;
  xeroItems: Observable<MappingDestination[]>;
  xeroTaxCodes: Observable<MappingDestination[]>;
  accountPayables: Observable<MappingDestination[]>;
  xeroAccounts: Observable<MappingDestination[]>;
  xeroTenants: Observable<MappingDestination[]>;
  generalMappings: Observable<GeneralMapping>;
  sourceWorkspace: Observable<{}>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  syncXeroDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.destinationWorkspace) {
      this.destinationWorkspace = this.apiService.post(`/workspaces/${workspaceId}/xero/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.destinationWorkspace;
  }

  syncFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.sourceWorkspace) {
      this.sourceWorkspace = this.apiService.post(`/workspaces/${workspaceId}/fyle/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.sourceWorkspace;
  }

  refreshXeroDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/xero/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {});
  }

  refreshDimension() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    this.apiService.post(`/workspaces/${workspaceId}/xero/refresh_dimensions/`, {}).subscribe();
    this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {}).subscribe();
  }

  postFyleEmployees(): Observable<MappingSource[]> {
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

  postFyleCategories(): Observable<MappingSource[]> {
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

  postFyleProjects(): Observable<MappingSource[]> {
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

  postFyleCostCenters(): Observable<MappingSource[]> {
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

  postExpenseCustomFields(): Observable<MappingSource[]> {
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

  postXeroTrackingCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.xeroTrackingCategories) {
      this.xeroTrackingCategories = this.apiService.post(`/workspaces/${workspaceId}/xero/tracking_categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroTrackingCategories;
  }

  postXeroItems() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.xeroItems) {
      this.xeroItems = this.apiService.post(`/workspaces/${workspaceId}/xero/items/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroItems;
  }

  postXeroContacts() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    if (!this.xeroContacts) {
      this.xeroContacts = this.apiService.post(`/workspaces/${workspaceId}/xero/contacts/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroContacts;
  }

  postXeroTenants() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.xeroTenants) {
      this.xeroTenants = this.apiService.post(`/workspaces/${workspaceId}/xero/tenants/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.xeroTenants;
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


  getFyleEmployees(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleExpenseFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCategories(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getXeroFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/xero_fields/`, {});
  }

  getXeroTrackingCategories(attributeType: string): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/tracking_categories/`, {
      attribute_type: attributeType
    });
  }

  getXeroContacts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/contacts/`, {});
  }

  getBankAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/xero/bank_accounts/`, {}
    );
  }

  getXeroTaxCodes(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/xero/tax_codes/`, {});
  }

  getXeroTenants(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/xero/tenants/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalMappingsCache
  })
  postGeneralMappings(generalMappings: GeneralMapping) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  @Cacheable({
    cacheBusterObserver: generalMappingsCache
  })
  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  getTenantMappings(): Observable<TenantMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/tenant/`, {}
    );
  }

  getMappings(sourceType: string, limit: number = 500, uri: string = null, pageOffset: number = 0, tableDimension: number = 2): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const url = uri ? uri.split('/api')[1] : `/workspaces/${workspaceId}/mappings/?limit=${limit}&offset=${pageOffset}&source_type=${sourceType}&table_dimension=${tableDimension}`;
    return this.apiService.get(url, {});
  }

  getAllMappings(sourceType: string): Observable<Mapping[]> {
    const that = this;
    return this.getMappings(sourceType).pipe(expand((res: MappingsResponse) => {
      // tslint:disable-next-line
      return res.next ? that.getMappings(sourceType, 500, res.next) : empty();
    }), concatMap((res: MappingsResponse) => res.results),
      reduce((arr: Mapping[], val: Mapping) => {
        arr.push(val);
        return arr;
      }, []));
  }

  postMappings(mapping: Mapping): Observable<Mapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  triggerAutoMapEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }
}
