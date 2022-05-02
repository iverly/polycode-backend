import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEventsService } from '../services/user.service';

@Injectable()
export class UserEventsListener {
  constructor(private readonly userEventsService: UserEventsService) {}

  @OnEvent('user.created')
  onUserCreated(user: Record<string, unknown>) {
    this.userEventsService.handleNewUser(user);
  }

  @OnEvent('user.verify_email.token.created')
  onUserVerifyEmailTokenCreated({
    user,
    token,
  }: {
    user: Record<string, unknown>;
    token: string;
  }) {
    this.userEventsService.handleNewUserVerifyEmailToken(user, token);
  }
}
