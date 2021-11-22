/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type MappingSetting = {
  id?: number;
  source_field: string;
  destination_field: string;
  is_custom?: boolean;
  import_to_fyle?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
