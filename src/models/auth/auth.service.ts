import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { IResponse } from './interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<IUser> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatched: boolean = await bcrypt.compare(password, user.password);
      if (isMatched) {
        const { password, tokenResetPassword, ...others } = user;
        const data = { password, tokenResetPassword, response: others };
        return data.response;
      } else {
        return null;
      }
    }
  }

  async login(user: Partial<IUser>) {
    const payload = { email: user.email, id: user.id, type: user.type };
    return { user: user, token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserDto): Promise<IResponse | undefined> {
    try {
      const identifyCard = user.identifyCard;
      const email = user.email;
      const exitsEmail = await this.userRepository.findOne({ email });
      const exitsIdentifyCard = await this.userRepository.findOne({
        identifyCard,
      });
      if (!exitsEmail && !exitsIdentifyCard) {
        const pwd = user.password;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(pwd, salt);
        const saveUser = {
          ...user,
          password: hashPassword,
        };
        const newUser = await this.userRepository.save(saveUser);
        const { password, type, tokenResetPassword, ...others } = newUser;
        const data = { password, type, tokenResetPassword, response: others };
        const result = {
          status: 200,
          data: data.response,
          msg: 'Success',
        };
        return result;
      } else {
        if (!!exitsEmail) {
          throw new HttpException('Email da duoc dang ky', 442);
        } else {
          throw new HttpException('So CMND da duoc dang ky', 442);
        }
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async logout() {
    return {
      status: 200,
      msg: 'Logout success',
    };
  }
}
