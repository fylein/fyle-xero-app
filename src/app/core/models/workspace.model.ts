/* tslint:disable */
import { User } from "./user.model";

export type Workspace = {
  id?: number;
  name: string;
  user: User[];
  fyle_org_id: string;
  xero_short_code: string;
  last_synced_at?: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  app_version: 'v1' | 'v2';
  onboarding_state: string;
  created_at?: Date;
  updated_at?: Date;
};

export type MinimalPatchWorkspace = {
  app_version: string;
  onboarding_state?: string;
};