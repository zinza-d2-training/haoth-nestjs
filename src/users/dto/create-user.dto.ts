import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  identify_card: string;

  @IsNotEmpty()
  password: string;

  birthday: string;
  gender: string;
  province: string;
  district: string;
  ward: string;
}
