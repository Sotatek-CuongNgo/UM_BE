import { Controller, Get, Patch, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-access';
import { UserService } from './user.service';
import { RoleGuard } from 'src/app/guards/role.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { ChangeDepartmentDto } from './dto/change-department.dto';
import { UpdateInfomationDto } from './dto/update-infomation.dto';
import { Roles } from 'src/app/enums/common.enum';

@ApiBearerAuth()
@ApiTags('User Management')
@UseGuards(RoleGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @AllowAccess(Roles.ADMIN)
  @ApiOperation({ summary: 'Get list of users'})
  @Get('/list')
  async getUserList(@Query() query: SearchUserDto) {
    return this.userService.getUserList(query);
  }

  @AllowAccess(Roles.ADMIN)
  @ApiOperation({ summary: 'Change user department'})
  @Patch('/:userId/department')
  async changeDepartment(@Param('userId') userId: number, @Body() body: ChangeDepartmentDto) {
    return this.userService.changeDepartment(userId, body);
  }

  @AllowAccess(Roles.ADMIN)
  @ApiOperation({ summary: 'Delete user'})
  @Delete('/:userId')
  async deleteUser(@Param('userId') userId: number) {
    return this.userService.delete(userId);
  }

  @AllowAccess(Roles.EMPLOYEE, Roles.ADMIN)
  @ApiOperation({ summary: 'Get user infomation'})
  @Get('/:userId')
  async getUserInfo(@Param('userId') userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @AllowAccess(Roles.EMPLOYEE)
  @ApiOperation({ summary: 'Update user infomation'})
  @Patch('/:userId/info')
  async updateUserInfomation(@Param('userId') userId: number, @Body() body: UpdateInfomationDto) {
    return this.userService.updateInformation(userId, body);
  } 
}
