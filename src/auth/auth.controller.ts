import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/loginUser.dto';

@Controller('auth') // /auth/register
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    const token = await this.authService.registerUser(registerUserDto);
    return token;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    const token = await this.authService.loginUser(loginUserDto);
    return token;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub as string;

    const user = await this.userService.getUserById(userId);

    return {
      id: user?._id,
      fname: user?.fname,
      lname: user?.lname,
      email: user?.email,
    };
  }
}