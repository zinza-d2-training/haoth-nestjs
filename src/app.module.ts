import { AuthModule } from './models/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from '@squareboat/nest-console';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AdministrativeUnitModule } from './models/administrative_units/administrativeunit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConsoleModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsersModule,
    AdministrativeUnitModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
