import { Injectable } from '@angular/core';
import { Observable, Subject, merge, forkJoin, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { XeroCredentials } from '../models/xero-credentials.model';
import { Settings } from '../models/settings.model';

const fyleCredentialsCache = new Subject<void>();
const xeroCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();
const tenantMappingCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<FyleCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  deleteFyleCredentials(workspaceId: number) {
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/fyle/delete/', {});
  }

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache
  })
  getXeroCredentials(workspaceId: number): Observable<XeroCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/xero/', {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string) {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  connectXero(workspaceId: number, code) {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_xero/authorization_code/', code
    );
  }

  postSettings(workspace_id: number, nextRun: string, hours: number, scheduleEnabled: boolean) {
    return this.apiService.post(`/workspaces/${workspace_id}/schedule/`, {
      next_run: nextRun,
      hours: hours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(workspaceId: number): Observable<Settings> {
    return this.apiService.get(`/workspaces/${workspaceId}/schedule/`, {});
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, reimbursableExpensesObject: string, corporateCreditCardExpensesObject: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/general/`, {
      reimbursable_expenses_object: reimbursableExpensesObject,
      corporate_credit_card_expenses_object: corporateCreditCardExpensesObject,
    });
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: any) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }
  
  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: tenantMappingCache
  })
  postTenantMappings(workspaceId: number, tenantName: string, tenantId: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/tenant/`, {
      tenant_name: tenantName,
      tenant_id: tenantId
    });
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: merge(generalSettingsCache, generalSettingsCache)
  })
  getCombinedSettings(workspaceId: number) {
    // TODO: remove promises and do with rxjs observables
    return from(forkJoin(
      [
        this.getGeneralSettings(workspaceId),
        this.getMappingSettings(workspaceId)
      ]
    ).toPromise().then(responses => {
      const generalSettings = responses[0];
      const mappingSettings = responses[1].results;

      const projectFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      if (projectFieldMapping) {
        generalSettings.project_field_mapping = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        generalSettings.cost_center_field_mapping = costCenterFieldMapping.destination_field;
      }

      return generalSettings;
    }));
  }
}
