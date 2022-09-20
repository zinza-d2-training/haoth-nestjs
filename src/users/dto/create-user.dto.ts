import { IsDefined, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsLength } from './length.dto';

export class CreateUserDto {
  @IsDefined()
  name: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @IsLength({ message: 'Identify card must equal 9 or 12 number' })
  identify_card: string;

  @IsDefined()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  birthday: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  ward: string;
}
