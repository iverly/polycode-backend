import { DynamicModule, Module } from '@nestjs/common';
import { EventConsumerListener } from './event-consumer.listener';
import { EVENT_CONSUMER_MODULE_OPTIONS_PROVIDER } from './event-consumer.constants';
import { EventService } from '@polycode/event';

export interface EventModuleOptions {
  prefix?: string;
}

@Module({
  controllers: [],
  providers: [EventService],
  exports: [],
})
export class EventConsumerModule {
  static register(options: EventModuleOptions): DynamicModule {
    return {
      module: EventConsumerModule,
      providers: [
        {
          provide: EVENT_CONSUMER_MODULE_OPTIONS_PROVIDER,
          useValue: options,
        },
        EventConsumerListener,
      ],
      exports: [EventConsumerListener],
    };
  }
}
