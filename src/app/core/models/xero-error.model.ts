/* tslint:disable */

import { XeroErrorDetail } from "./xero-error-detail.model";

export type XeroError = {
    error: {
        Type: string;
        Message: string;
        Elements: XeroErrorDetail[];
        ErrorNumber: number;
    };
    message: string;
    expense_group_id: number;
};
