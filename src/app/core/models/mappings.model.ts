import { MappingDestination } from './mapping-destination.model';
import { MappingSource } from './mapping-source.model';

/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type Mapping = {
  id?: number;
  source?: MappingSource;
  source_value?: string;
  destination?: MappingDestination;
  source_type: string;
  destination_type: string;
  destination_value?: string;
  destination_id?: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
