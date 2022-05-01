import { Injectable } from '@nestjs/common';
import { EmailSenderService } from '@polycode/email-sender';

export enum EmailTemplate {
  USER_WELCOME,
}

@Injectable()
export class NotificationProviderService {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  /**
   * "Send an email to the specified recipient with the specified subject and text."
   *
   * The function is async, so it returns a promise. The promise resolves when the email has been sent
   * @param {string} to - The email address of the recipient.
   * @param {string} subject - The subject of the email
   * @param {string} text - The text of the email.
   */
  async sendTextEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void> {
    await this.emailSenderService.sendEmail(to, subject, text);
  }

  /**
   * "If the template is a welcome email, send a welcome email."
   *
   * The problem is that the compiler doesn't know that the `data` parameter is a `Record<string,
   * unknown>` when the template is `EmailTemplate.USER_WELCOME`
   * @param {string} to - The email address of the recipient.
   * @param {EmailTemplate} template - This is the template we want to use.
   * @param data - Record<string, unknown> = {}
   */
  async sendTemplatedEmail(
    to: string,
    template: EmailTemplate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = {}
  ): Promise<void> {
    switch (template) {
      case EmailTemplate.USER_WELCOME:
        this.emailSenderService.sendWelcomeEmail(to, data);
        break;
      default:
    }
  }
}
