import { User } from './user.model';

export interface Token {
  access_token: string;
  refresh_token: string;
  user: User;
}
