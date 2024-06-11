import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
