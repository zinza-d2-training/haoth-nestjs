import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-uses.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: LoginUserDto) {
    return this.authService.login(req.user);
  }

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Get('/logout')
  async logout() {
    return await this.authService.logout();
  }
}