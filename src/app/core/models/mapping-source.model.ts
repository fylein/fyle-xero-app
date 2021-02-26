/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseAttributeDetail } from "./expense-attribute-detail.model";

export type MappingSource = {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  source_id: number;
  auto_mapped: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: ExpenseAttributeDetail;
};
