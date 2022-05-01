import { Injectable } from '@nestjs/common';
import { NotificationProviderService } from '@polycode/notification-provider';

export enum EmailTemplate {
  USER_WELCOME,
}

@Injectable()
export class NotificationConsumerService {
  constructor(
    private readonly notificationProviderService: NotificationProviderService
  ) {}

  /**
   * This function sends a text email to the specified recipient
   * @param {string} to - The email address of the recipient.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The text of the email.
   */
  async sendTextEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void> {
    await this.notificationProviderService.sendTextEmail(to, subject, text);
  }

  /**
   * Send an email to the given address using the given template and data.
   * @param {string} to - The email address of the recipient.
   * @param {EmailTemplate} template - This is the template that you want to use.
   * @param data - Record<string, unknown> = {}
   */
  async sendTemplatedEmail(
    to: string,
    template: EmailTemplate,
    data: Record<string, unknown> = {}
  ): Promise<void> {
    this.notificationProviderService.sendTemplatedEmail(to, template, data);
  }
}
