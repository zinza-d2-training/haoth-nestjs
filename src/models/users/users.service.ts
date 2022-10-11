import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { IUser, IUserResponse } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  private readonly users: IUserResponse[] = [];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<IUser>> {
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
        const res = { msg: 'Success' };
        return res;
      }
      throw new HttpException('Cannot delete', HttpStatus.NOT_ACCEPTABLE);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number): Promise<Partial<IUser>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['ward', 'ward.district', 'ward.district.province'],
      });
      if (user) {
        const { password, type, tokenResetPassword, ...others } = user;
        const data = { password, type, tokenResetPassword, response: others };
        const result = data.response;
        return result;
      }
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(username: string): Promise<IUser | null> {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });
    if (!!user) {
      return user;
    } else {
      return null;
    }
  }

  async findAll(): Promise<Partial<IUser>[]> {
    try {
      const listUsers = await this.userRepository.find();
      if (listUsers) {
        const result = listUsers.map((user: User) => {
          const { password, type, tokenResetPassword, ...others } = user;
          const data = { password, type, tokenResetPassword, response: others };
          return data.response;
        });
        return result;
      }
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
