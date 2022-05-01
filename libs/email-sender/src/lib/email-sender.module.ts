import { Module } from '@nestjs/common';
import { EmailSenderService } from './services/sender.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { TemplateService } from './services/template.service';

@Module({
  imports: [ConfigModule.forRoot({ validate })],
  controllers: [],
  providers: [EmailSenderService, TemplateService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
