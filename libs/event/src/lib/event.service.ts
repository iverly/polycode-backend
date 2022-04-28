import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONSUMER_EVENT_PREFIX } from './event.constants';

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(event: string, data: Record<string, unknown>) {
    const newEventName = `${CONSUMER_EVENT_PREFIX}.${event}`;

    this.eventEmitter.emitAsync(newEventName, {
      ...data,
      _metadata: {
        name: newEventName,
        originalName: event,
      },
    });
  }

  emitInternal(event: string, data: Record<string, unknown>) {
    this.eventEmitter.emitAsync(event, {
      ...data,
      _metadata: {
        name: event,
      },
    });
  }
}
