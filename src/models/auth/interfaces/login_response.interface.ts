import { IUser } from './user.interface';

export interface ILoginResponse {
  user: Partial<IUser>;
  token: string;
}
