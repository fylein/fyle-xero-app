/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class Organization {
  id: string;
  created_at: Date;
  updated_at: Date
  name: string;
  domain: string;
  currency: string;
  branch_ifsc: string;
  branch_account: string;
  tally_bank_ledger: string;
  tally_default_category: string;
  tally_default_user: string;
  corporate_credit_card_details: {
    bank_name: string;
    number_of_cards: number
  };
  verified: boolean;
  lite: boolean;
  dwolla_customers_metadata_id: string
}