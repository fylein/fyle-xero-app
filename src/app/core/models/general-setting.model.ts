/* tslint:disable */
export type GeneralSetting = {
    id?: number;
    reimbursable_expenses_object: string;
    corporate_credit_card_expenses_object: string;
    import_projects?: boolean;
    import_categories: boolean;
    charts_of_accounts: string[];
    change_accounting_period: boolean;
    sync_fyle_to_xero_payments: boolean;
    sync_xero_to_fyle_payments: boolean;
    auto_map_employees: string;
    auto_create_destination_entity: boolean;
    auto_create_merchant_destination_entity: boolean;
    skip_cards_mapping?: boolean;
    import_tax_codes: boolean;
    import_customers: boolean;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
};
