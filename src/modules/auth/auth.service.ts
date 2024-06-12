import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from '../base/base.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from 'src/app/enums/common.enum';
import { constants } from 'src/app/constants/common.constant';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly trans: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  async signUp(body: SignUpDto) {
    const { username, email, password } = body;
    const user = await this.userService.findOne(email);
    if (user) throw new BadRequestException(this.trans.t('messages.EXIST', { args: { object: 'Account' } }));

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username,
      email,
      password: hashedPassword,
      role: Roles.EMPLOYEE
    };
    await this.userService.create(userData);
    return this.responseOk({}, this.trans.t('messages.SIGNUP_SUCCESS'));
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.userService.findOne(email);
    if (!user) throw new NotFoundException(this.trans.t('messages.NOT_FOUND', { args: { object: 'User' } }));

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) throw new UnauthorizedException(this.trans.t('messages.PASSWORD_INCORRECT'));

    const accessPayload = { id: user.id, email: user.email, role: user.role };
    const refreshPayload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(accessPayload, { expiresIn: constants.ACCESS_TOKEN.EXPIRES_IN });
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: constants.REFRESH_TOKEN.EXPIRES_IN });
    await this.cacheManager.set(`refresh_token_${user.id}`, refreshToken, { ttl: constants.REFRESH_TOKEN.TLL });
    return this.responseOk({
      accessToken,
      refreshToken,
    });
  }

  async logout(userId: number) {
    await this.cacheManager.del(`refresh_token_${userId}`);
    return this.responseOk();
  }
}
