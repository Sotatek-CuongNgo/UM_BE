import { Body, Controller, Get, Post, Patch, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-access';
import { RoleGuard } from 'src/app/guards/role.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { SearchDepartmentDto } from './dto/search-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from 'src/app/enums/common.enum';

@ApiBearerAuth()
@ApiTags('Deparment Management')
@UseGuards(RoleGuard)
@AllowAccess(Roles.ADMIN)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Get list of departments' })
  @Get('/list')
  async getDepartmentList(@Query() query: SearchDepartmentDto) {
    return this.departmentService.getDepartmentList(query);
  }

  @ApiOperation({ summary: 'Get department information' })
  @Get('/:deparmentId')
  async getDepartmentInfo(@Param('deparmentId') deparmentId: number) {
    return this.departmentService.getDepartmentInfo(deparmentId);
  }

  @ApiOperation({ summary: 'Create new department' })
  @Post()
  async createDepartment(@Body() body: CreateDepartmentDto) {
    return this.departmentService.createDepartment(body);
  }

  @ApiOperation({ summary: 'Update department information' })
  @Patch('/:departmentId')
  async updateDepartment(@Param('departmentId') departmentId: number, @Body() body: UpdateDepartmentDto) {
    return this.departmentService.updateDepartment(departmentId, body);
  }

  @ApiOperation({ summary: 'Delete deparment' })
  @Patch('/:departmentId')
  async deleteDepartment(@Param('departmentId') departmentId: number) {
    return this.departmentService.deleteDepartment(departmentId);
  }
}
