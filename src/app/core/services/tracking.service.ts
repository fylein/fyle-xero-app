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

  eventTrack(action, properties) {
    properties = {
      ...properties,
      Asset: 'NetSuite Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  onSignIn(email: string, properties) {
    if (this.tracking) {
      this.tracking.identify(email, {
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign In', properties);
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

  onSignOut(properties= {}) {
    this.eventTrack('Sign Out', properties);
  }

  onSwitchWorkspace(properties= {}) {
    this.eventTrack('Switching Workspace', properties);
  }
}

