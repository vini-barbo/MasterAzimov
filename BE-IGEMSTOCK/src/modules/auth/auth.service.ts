import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    full_name: string;
    roles: string[];
    is_active: boolean;
    created_at: string;
  };
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: [user.role],
    };

    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.username,
        roles: [user.role],
        is_active: user.isActive,
        created_at: user.createdAt.toISOString(),
      },
      access_token,
      refresh_token,
    };
  }

  async register(registerDto: RegisterDto): Promise<{ user: any }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create username from email if not provided
    const username = registerDto.email.split('@')[0];

    // Check if username already exists
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      username,
      password: registerDto.password,
      firstName: registerDto.full_name.split(' ')[0],
      lastName:
        registerDto.full_name.split(' ').slice(1).join(' ') || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.username,
        roles: [user.role],
        is_active: user.isActive,
        created_at: user.createdAt.toISOString(),
      },
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refresh_token,
        {
          secret: this.configService.get<string>('app.jwtSecret'),
        },
      );

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: [user.role],
      };

      const access_token = await this.generateAccessToken(newPayload);
      const refresh_token = await this.generateRefreshToken(newPayload);

      return { access_token, refresh_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      full_name:
        `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
        user.username,
      roles: [user.role],
      is_active: user.isActive,
      created_at: user.createdAt.toISOString(),
    };
  }

  async updateProfile(userId: string, updateData: UpdateUserDto) {
    const user = await this.usersService.update(userId, updateData);

    return {
      id: user.id,
      email: user.email,
      full_name:
        `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
        user.username,
      roles: [user.role],
      is_active: user.isActive,
      created_at: user.createdAt.toISOString(),
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: this.configService.get<string>('app.jwtExpiresIn'),
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: '7d', // Refresh token expires in 7 days
    });
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}
