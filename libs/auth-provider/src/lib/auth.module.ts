import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { validate } from './env.validation';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeModels } from './models';
import { AuthService } from './services/auth.service';
import { OAuth2Service } from './services/oauth2.service';
import { TokenService } from './services/token.service';
import { ClientService } from './services/client.service';
import { SubjectService } from './services/subject.service';
import { CryptoService } from './services/crypto.service';
import { AuthController } from './auth.controller';
import { CaslModule } from '@polycode/casl';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    JwtModule.register({ secret: process.env.AUTH_JWT_SECRET }),
    SequelizeModule.forFeature(sequelizeModels),
    CaslModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OAuth2Service,
    TokenService,
    ClientService,
    SubjectService,
    CryptoService,
  ],
  exports: [AuthService],
})
export class AuthProviderModule {}
