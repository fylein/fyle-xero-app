/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type UserProfile = {
    data: {
      user_id: string;
      org_id: string;
      org: {
        id: string;
        name: string;
        domain: string;
        currency: string;
      },
      user: {
        id: string;
        email: string;
        full_name: string;
      },
      roles: string[];
    }
};
