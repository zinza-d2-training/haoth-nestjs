export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  identify_card: string;
  birthday: string;
  gender: string;
  province: string;
  district: string;
  ward: string;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
}

export type IUserResponse = Partial<IUser>;
