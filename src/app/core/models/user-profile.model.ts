/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class UserProfile {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  employee_email: string;
  employee_code: string;
  full_name: string;
  joining_date: Date;
  location: string;
  level_id: string;
  level: string;
  business_unit: string;
  department_id: string;
  department_code: string;
  department: string;
  sub_department: string;
  approver1_email: string;
  approver2_email: string;
  approver3_email: string;
  title: string;
  branch_ifsc: string;
  branch_account: string;
  mobile: string;
  delegatee_email: string;
  default_cost_center_name: string;
  cost_center_names: string[];
  perdiem_names: string;
  mileage_rate_labels: string;
  annual_mileage_of_user_before_joining_fyle: {
      two_wheeler: number;
      four_wheeler: number;
      four_wheeler1: number;
      four_wheeler3: number;
      four_wheeler4: number;
      bicycle: number;
      electric_car: number
  };
  custom_fields: [];
  disabled: boolean;
  org_id: string;
  org_name: string;
}