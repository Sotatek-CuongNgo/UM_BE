import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from '../base/base.service';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { ChangeDepartmentDto } from './dto/change-department.dto';
import { UpdateInfomationDto } from './dto/update-infomation.dto';
import { Roles } from 'src/app/enums/common.enum';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly trans: I18nService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Department) private departmentRepo: Repository<User>,
  ) {
    super();
  }

  async getUserList(query: SearchUserDto) {
    const { search, page, limit } = query;
    const queryBuilder = this.userRepo
      .createQueryBuilder('U')
      .leftJoinAndSelect('U.department', 'D')
      .where('U.role = :role', { role: Roles.EMPLOYEE });

    if (search) {
      queryBuilder.where(this.searchCaseInsensitive('U.username'), { keyword: `%${search}%` });
    }
    queryBuilder.orderBy('U.updatedAt', 'DESC');

    const users = await this.customPaginate<User>(queryBuilder, page, limit);
    return this.responseOk(users);
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['department'] });
    return this.responseOk(user);
  }

  async updateInformation(userId: number, body: UpdateInfomationDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'User' } }));

    await this.userRepo.update({ id: userId }, { ...body });
    return this.responseOk();
  }

  async changeDepartment(userId: number, body: ChangeDepartmentDto) {
    const { departmentId } = body;
    const department = await this.departmentRepo.findOneBy({ id: departmentId });
    if (!department)
      throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'Department' } }));

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'User' } }));

    await this.userRepo.update({ id: userId }, { ...body });
    return this.responseOk();
  }

  async delete(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException(this.trans.t('messages.NOT_FOUND', { args: { object: 'User' } }));

    await this.userRepo.remove(user);
    return this.responseOk();
  }

  async create(data) {
    return await this.userRepo.save(data);
  }

  async findOne(email: string) {
    return await this.userRepo.findOneBy({ email });
  }
}
