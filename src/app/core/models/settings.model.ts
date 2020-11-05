import { ScheduleSettings } from './schedule-settings.model';

/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class Settings {
  id: number;
  workspace: number;
  enabled: boolean;
  start_datetime: Date;
  interval_hours: number;
  fyle_job_id: string
  created_at: Date;
  updated_at: Date;
}