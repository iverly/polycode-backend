import { Module } from '@nestjs/common';
import { EventService } from './event.service';

@Module({
  controllers: [],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
