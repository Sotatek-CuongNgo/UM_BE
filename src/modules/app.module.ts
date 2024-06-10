import { Module } from '@nestjs/common';
import { BaseModule } from './base/base.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [BaseModule, AuthModule, UserModule, DepartmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
