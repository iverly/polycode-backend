import { Module } from '@nestjs/common';
import { UserProviderController } from './user.controller';
import { UserProviderService } from './user.service';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeModels } from './models';

@Module({
  imports: [AuthConsumerModule, SequelizeModule.forFeature(sequelizeModels)],
  controllers: [UserProviderController],
  providers: [UserProviderService],
  exports: [UserProviderService],
})
export class UserProviderModule {}
