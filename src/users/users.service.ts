import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/typeorm/entities/user.entity';
import { IUserResponse } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  private readonly users: IUserResponse[] = [];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const pwd = user.password;
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(pwd, salt);
      user = {
        ...user,
        password: hashPassword,
      };
      const newUser = await this.userRepository.save(user);
      const { password, isAdmin, tokenResetPassword, ...others } = newUser;
      const data = { password, isAdmin, tokenResetPassword, response: others };
      const result = { status: 200, data: data.response, msg: 'Success' };
      return result;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!!user) {
      const { password, isAdmin, tokenResetPassword, ...others } = user;
      const data = { password, isAdmin, tokenResetPassword, response: others };
      const result = { status: 200, data: data.response, msg: 'success' };
      return result;
    } else {
      const result = { status: 404, data: {}, msg: 'Not found user' };
      return result;
    }
  }

  async findAll() {
    const listUsers = await this.userRepository.find();
    const result = listUsers.map((user: User) => {
      const { password, isAdmin, tokenResetPassword, ...others } = user;
      const data = { password, isAdmin, tokenResetPassword, response: others };
      return data.response;
    });
    return { status: 200, data: result, msg: 'success' };
  }
}
