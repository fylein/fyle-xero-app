/* tslint:disable */
export type ExpenseGroupSetting = {
    id?: number;
    reimbursable_expense_group_fields: string[];
    corporate_credit_card_expense_group_fields: string[];
    expense_state: string;
    reimbursable_export_date_type: string;
    ccc_export_date_type: string;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
};
