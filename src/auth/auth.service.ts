import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create(
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );

    return this.signToken(user.id, user.email);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.signToken(user.id, user.email);
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: userId, email });
    return { accessToken };
  }
}
