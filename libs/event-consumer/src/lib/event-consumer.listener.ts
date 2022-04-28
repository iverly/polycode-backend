import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_CONSUMER_MODULE_OPTIONS_PROVIDER } from './event-consumer.constants';
import { EventService, CONSUMER_EVENT_PREFIX } from '@polycode/event';

interface EventMetadata {
  name: string;
  originalName: string;
}

@Injectable()
export class EventConsumerListener {
  private prefix: string;

  constructor(
    @Inject(EVENT_CONSUMER_MODULE_OPTIONS_PROVIDER)
    private options: EventConsumerListener,
    private readonly eventService: EventService
  ) {
    this.prefix = options.prefix || '';
  }

  @OnEvent(`**`)
  onEvent(event: Record<string, unknown>) {
    if (!event._metadata || typeof event._metadata !== 'object') {
      return;
    }

    const { name, originalName } = event._metadata as EventMetadata;

    if (!name || typeof name !== 'string') {
      return;
    }

    if (!this.checkPrefixEvent(name)) {
      return;
    }

    this.eventService.emitInternal(originalName, {
      ...event,
    });
  }

  checkPrefixEvent(eventName: string): boolean {
    return eventName.startsWith(`${CONSUMER_EVENT_PREFIX}.${this.prefix}`);
  }
}
