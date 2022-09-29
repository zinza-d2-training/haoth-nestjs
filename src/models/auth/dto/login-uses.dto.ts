import { IsDefined, IsEmail } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class LoginUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  password: string;

  user?: Partial<IUser>;
}
