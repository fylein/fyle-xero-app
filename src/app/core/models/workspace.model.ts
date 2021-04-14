/* tslint:disable */
import { User } from "./user.model";

export type Workspace = {
  id?: number;
  name: string;
  user: User[];
  fyle_org_id: string;
  last_synced_at?: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  created_at?: Date;
  updated_at?: Date;
};
