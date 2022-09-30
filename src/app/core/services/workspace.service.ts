import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { MinimalPatchWorkspace, Workspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) { }

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaces(orgId): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  patchWorkspace(workspace: MinimalPatchWorkspace): Observable<Workspace> {
    return this.apiService.patch(`/workspaces/${this.getWorkspaceId()}/`, workspace);
  }

  getWorkspaceById(): Observable<Workspace> {
    const workspaceId = this.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/`, {});
  }

  getWorkspaceId(): number {
    const id = this.storageService.get('workspaceId');
    return id ? +id : null;
  }

  // TODO: Add a method with implicit workspace id and replace calls everwhere
}
