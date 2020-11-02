/* tslint:disable */
// TODO: Use something for serialization / deserialization
export interface Expense {
  amount: number;
  approved_at: Date;
  category: string;
  claim_number: string;
  cost_center: string;
  created_at: Date;
  currency: string;
  employee_email: string;
  expense_created_at: Date;
  expense_id: string;
  expense_number: string;
  expense_updated_at: Date;
  exported: boolean;
  foreign_amount: number;
  foreign_currency: string;
  fund_source: string;
  id: number;
  project: string;
  purpose: string;
  reimbursable: boolean;
  report_id: string;
  settlement_id: string;
  spent_at: Date;
  state: string;
  sub_category: string;
  updated_at: Date;
  vendor: string;
}
