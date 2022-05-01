import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEventsService } from '../services/user.service';

@Injectable()
export class UserEventsListener {
  constructor(private readonly userEventsService: UserEventsService) {}

  @OnEvent('user.created')
  onUserCreated(user) {
    this.userEventsService.handleNewUser(user);
  }
}
