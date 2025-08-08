import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }
      throw error;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, userId: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la génération du token');
    }
  }
}
