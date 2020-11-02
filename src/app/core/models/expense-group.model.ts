/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroupDescription } from './expense-group-description.model';

export interface ExpenseGroup {
  id: number;
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: number[];
}
