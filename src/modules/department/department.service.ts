import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from '../base/base.service';
import { Department } from 'src/entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { SearchDepartmentDto } from './dto/search-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService extends BaseService {
  constructor(
    private readonly trans: I18nService,
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
  ) {
    super();
  }

  async getDepartmentList(query: SearchDepartmentDto) {
    const { search, page, limit } = query;
    const queryBuilder = this.departmentRepo.createQueryBuilder('D');

    if (search) {
      queryBuilder.where(this.searchCaseInsensitive('D.name'), { keyword: `%${search}%` });
    }
    queryBuilder.orderBy('D.updatedAt', 'DESC');

    const departments = await this.customPaginate<Department>(queryBuilder, page, limit);
    return this.responseOk(departments);
  }

  async getDepartmentInfo(departmentId: number) {
    const department = await this.departmentRepo.findOneBy({ id: departmentId });
    return this.responseOk(department);
  }

  async createDepartment(body: CreateDepartmentDto) {
    const newDepartment = await this.departmentRepo.save(body);
    return this.responseOk({ id: newDepartment.id });
  }

  async updateDepartment(departmentId: number, body: UpdateDepartmentDto) {
    const department = await this.departmentRepo.findOneBy({ id: departmentId });
    if (!department)
      throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'Department' } }));

    await this.departmentRepo.update({ id: departmentId }, { ...body });
    return this.responseOk();
  }

  async deleteDepartment(departmentId: number) {
    const department = await this.departmentRepo.findOneBy({ id: departmentId });
    if (!department)
      throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'Department' } }));

    await this.departmentRepo.remove(department);
    return this.responseOk();
  }
}
