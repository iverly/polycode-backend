import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthProviderModule {}
