import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/app/guards/role.guard';
import { User } from 'src/app/decorators/user';
import { Public } from 'src/app/decorators/public';
import { AllowAccess } from 'src/app/decorators/allow-access';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Roles } from 'src/app/enums/common.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Sign up' })
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @AllowAccess()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  async logout(@User('id') id: number) {
    return this.authService.logout(id);
  }
}
