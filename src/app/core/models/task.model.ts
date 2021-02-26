/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { MappingError } from './mapping-error.model';

export type Task = {
  id: number;
  task_id: string;
  expense_group: number;
  detail: MappingError[];
  // TODO: check if we can create a type for this
  xero_errors: any[];
  status: string;
  type: string;
  bill: number;
  bank_transaction: number;
  payment: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
