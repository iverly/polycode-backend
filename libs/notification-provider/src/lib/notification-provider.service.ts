import { Injectable } from '@nestjs/common';
import { EmailSenderService } from '@polycode/email-sender';

export enum EmailTemplate {
  USER_WELCOME,
  USER_VERIFY_EMAIL,
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
   * It sends an email to a user based on the template and data provided
   * @param {string} to - The email address of the user you want to send the email to.
   * @param {EmailTemplate} template - This is the template that we want to send.
   * @param {any} data - any = {}
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
      case EmailTemplate.USER_VERIFY_EMAIL:
        this.emailSenderService.sendUserVerifyEmail(to, data);
        break;
      default:
    }
  }
}
