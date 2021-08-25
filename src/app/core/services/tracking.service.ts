import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class TrackingService {
  identityEmail = null;

  constructor(
  ) { }

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action: string, properties= {}) {
    properties = {
      ...properties,
      Asset: 'Xero Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  onSignIn(email: string, workspaceId: number, properties) {
    if (this.tracking) {
      this.tracking.identify(email, {
        workspaceId,
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign In', properties);
  }

  onPageVisit(page: string, onboarding: boolean= false) {
    let event = `Visited ${page} Page`;
    event = onboarding ? `Onboarding: ${event}` : event;
    this.eventTrack(event);
  }

  connectXero(properties= {}) {
    this.eventTrack('Connect Xero', properties);
  }

  selectTenant(properties= {}) {
    this.eventTrack('Select Tenant', properties);
  }

  mapFyleFieldsToXeroFields(properties= {}) {
    this.eventTrack('Map Fyle Fields To Xero Fields', properties);
  }

  mapBankAccounts(properties= {}) {
    this.eventTrack('Map Bank Accounts', properties);
  }

  mapEmployees(properties= {}) {
    this.eventTrack('Map Employees', properties);
  }

  mapCategories(properties= {}) {
    this.eventTrack('Map Categories', properties);
  }

  onSignOut() {
    this.eventTrack('Sign Out');
  }

  onSwitchWorkspace() {
    this.eventTrack('Switching Workspace');
  }
}

