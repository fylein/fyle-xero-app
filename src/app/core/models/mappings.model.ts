import { MappingDestination } from './mapping-destination.model';
import { MappingSource } from './mapping-source.model';

/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class Mapping {
  id: number;
  source: MappingSource;
  destination: MappingDestination;
  source_type: string;
  destination_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
