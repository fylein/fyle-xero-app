import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) { }

  // TODO: Replace any with proper model
  createWorkspace(): Observable<any> {
    return this.apiService.post('/workspaces/', {});
  }

  // TODO: Replace any with proper model
  getWorkspaces(orgId): Observable<any> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  getWorkspaceById(): Observable<any> {
    const workspaceId = this.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/`, {});
  }

  getWorkspaceId(): number {
    const id = this.storageService.get('workspaceId');
    return id ? +id : null;
  }

  // TODO: Add a method with implicit workspace id and replace calls everwhere
}
