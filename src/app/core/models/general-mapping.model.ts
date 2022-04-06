/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type GeneralMapping = {
  id?: number;
  bank_account_name: string;
  bank_account_id: string;
  payment_account_name: string;
  payment_account_id: string;
  default_tax_code_id: string;
  default_tax_code_name: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};

