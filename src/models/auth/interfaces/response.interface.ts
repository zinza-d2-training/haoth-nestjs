import { IUser } from './user.interface';

export interface IResponse {
  status: number;
  data: Partial<IUser>;
  msg: string;
}
