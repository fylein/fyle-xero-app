/* tslint:disable */
export type GeneralSetting = {
    id: number;
    reimbursable_expenses_object: string;
    corporate_credit_card_expenses_object: string;
    import_projects: boolean;
    import_categories: boolean;
    sync_fyle_to_xero_payments: boolean;
    sync_xero_to_fyle_payments: boolean;
    auto_map_employees: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
};
