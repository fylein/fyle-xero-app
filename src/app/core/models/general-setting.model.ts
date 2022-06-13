/* tslint:disable */
export type GeneralSetting = {
    id: number;
    reimbursable_expenses_object: string;
    corporate_credit_card_expenses_object: string;
    import_projects: boolean;
    import_categories: boolean;
    charts_of_accounts: string[];
    sync_fyle_to_xero_payments: boolean;
    sync_xero_to_fyle_payments: boolean;
    auto_map_employees: string;
    auto_create_destination_entity: boolean;
    skip_cards_mapping: boolean;
    import_tax_codes: boolean;
    created_at: Date;
    updated_at: Date;
    workspace: number;
};
