import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { IUser, IUserResponse } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { IArrayResponse, IResponse } from './interfaces/response.interface';
@Injectable()
export class UsersService {
  private readonly users: IUserResponse[] = [];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IResponse> {
    try {
      const oldPwd = updateUserDto.password;
      if (!!oldPwd) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(oldPwd, salt);
        await this.userRepository.update(
          { id },
          {
            ...updateUserDto,
            password: hashPassword,
          },
        );
      } else {
        await this.userRepository.update({ id }, updateUserDto);
      }
      const user = this.findOne(id);
      return user;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async delete(id: number) {
    try {
      const del = await this.userRepository.delete({ id });
      if (del.affected === 1) {
        const res = { status: 200, msg: 'Success' };
        return res;
      } else {
        const res = { status: 404, msg: 'Failed' };
        return res;
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number): Promise<IResponse> {
    const user = await this.userRepository.findOne({ id });
    if (!!user) {
      const { password, type, tokenResetPassword, ...others } = user;
      const data = { password, type, tokenResetPassword, response: others };
      const result = { status: 200, data: data.response, msg: 'success' };
      return result;
    } else {
      const result = { status: 404, data: {}, msg: 'Not found user' };
      return result;
    }
  }

  async findByEmail(username: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });
    if (!!user) {
      return user;
    } else {
      return null;
    }
  }

  async findAll(): Promise<IArrayResponse> {
    const listUsers = await this.userRepository.find();
    const result = listUsers.map((user: User) => {
      const { password, type, tokenResetPassword, ...others } = user;
      const data = { password, type, tokenResetPassword, response: others };
      return data.response;
    });
    return { status: 200, data: result, msg: 'success' };
  }
}
