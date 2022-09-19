import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    return await this.userRepository.save(user);
  }

  findAll(): User[] {
    return this.users;
  }
}
