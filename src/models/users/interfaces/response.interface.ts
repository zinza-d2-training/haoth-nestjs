import { IUser } from './user.interface';

export interface IResponse {
  status: number;
  data: Partial<IUser>;
  msg: string;
}

export interface IArrayResponse {
  status: number;
  data: Partial<IUser>[];
  msg: string;
}
