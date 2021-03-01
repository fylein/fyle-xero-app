/* tslint:disable */

import { XeroValidationError } from "./xero-validation-error.model";

// having any across this file is okay
export type XeroErrorDetail = {
    Date: Date;
    Type: string;
    Total: number;
    Status: string;
    Contact: {
        Phones: any[];
        Addresses: any[];
        ContactID: string;
        ContactGroups: any[];
        ContactPersons: any[];
        ValidationErrors: any[];
        HasValidationErrors: boolean;
    };
    DueDate: Date;
    Payments: any[];
    SubTotal: number;
    TotalTax: number;
    HasErrors: boolean;
    InvoiceID: string;
    LineItems: any[];
    Reference: string;
    DateString: Date;
    CreditNotes: any[];
    Prepayments: any[];
    CurrencyCode: string;
    IsDiscounted: boolean;
    Overpayments: any[];
    DueDateString: Date;
    LineAmountTypes: string;
    ValidationErrors: XeroValidationError[];
};
