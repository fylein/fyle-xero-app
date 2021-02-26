/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroup } from './expense-group.model';

export type ExpenseGroupResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
};
