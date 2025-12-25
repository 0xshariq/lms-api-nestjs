import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterDto) {

    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    // todo: remove role admin from here. only for test.
    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    console.log(token);
    return { access_token: token };
  }

  async loginUser(loginUserDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}