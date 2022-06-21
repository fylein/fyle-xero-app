import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { XeroCredentials } from '../models/xero-credentials.model';
import { ScheduleSettings } from '../models/schedule-settings.model';
import { MappingSettingResponse } from '../models/mapping-setting-response.model';
import { GeneralSetting } from '../models/general-setting.model';
import { MappingSetting } from '../models/mapping-setting.model';
import { TenantMapping } from '../models/tenant-mapping.model';
import { environment } from 'src/environments/environment';

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

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache
  })
  getXeroCredentials(workspaceId: number): Observable<XeroCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/xero/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  deleteXeroCredentials(workspaceId: number) {
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/xero/delete/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  revokeXeroConnection(workspaceId: number) {
    return this.apiService.post('/workspaces/' + workspaceId + '/connection/xero/revoke/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string): Observable<FyleCredentials> {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  connectXero(workspaceId: number, code): Observable<XeroCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_xero/authorization_code/', code
    );
  }

  @Cacheable()
  getXeroTokenHealth(workspaceId: number): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/xero/token_health/`, {});
  }

  postSettings(workspaceId: number, scheduleHours: number, scheduleEnabled: boolean): Observable<ScheduleSettings> {
    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      hours: scheduleHours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(workspaceId: number): Observable<ScheduleSettings> {
    return this.apiService.get(`/workspaces/${workspaceId}/schedule/`, {});
  }

  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(workspaceId: number): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, generalSettingsPayload: GeneralSetting): Observable<GeneralSetting> {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/general/`, generalSettingsPayload);
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(workspaceId: number): Observable<GeneralSetting> {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  skipCardsMapping(workspaceId: number, ): Observable<GeneralSetting> {
    return this.apiService.patch(`/workspaces/${workspaceId}/settings/general/`, {
      skip_cards_mapping: true
    });
  }

  @CacheBuster({
    cacheBusterNotifier: tenantMappingCache
  })
  postTenantMappings(workspaceId: number, tenantName: string, tenantId: string): Observable<TenantMapping> {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/tenant/`, {
      tenant_name: tenantName,
      tenant_id: tenantId
    });
  }

  generateXeroConnectionUrl(workspaceId: number): string {
    return environment.xero_authorize_uri + '?client_id=' + environment.xero_client_id + '&scope=' + environment.xero_scope + '&response_type=code&redirect_uri=' + environment.xero_callback_uri + '&state=' + workspaceId;
  }
}
