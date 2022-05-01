import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { TemplateService, WelcomeTemplateData } from './template.service';

@Injectable()
export class EmailSenderService {
  private ses: SES;

  constructor(private readonly templateService: TemplateService) {
    const sesConfig = {
      accessKeyId: process.env.EMAIL_AWS_ACCESS_API_KEY,
      secretAccessKey: process.env.EMAIL_AWS_API_ACCESS_SECRET,
      region: process.env.EMAIL_AWS_REGION,
    };

    this.ses = new SES(sesConfig);
  }

  /**
   * It sends a welcome email to the given email address, using the given data to fill in the template
   * @param {string} to - The email address of the recipient.
   * @param {WelcomeTemplateData} data - WelcomeTemplateData
   */
  async sendWelcomeEmail(to: string, data: WelcomeTemplateData): Promise<void> {
    const template = this.templateService.getWelcomeTemplate(data);
    console.log(to, template);
    await this.sendEmail(to, template.subject, template.text);
  }

  /**
   * It sends an email
   * @param {string} to - The email address of the recipient.
   * @param {string} subject - The subject of the email
   * @param {string} text - The body of the email.
   * @param {string} [from] - The email address that the email is sent from.
   */
  async sendEmail(to: string, subject: string, text: string, from?: string) {
    const options: SES.SendEmailRequest = {
      Source: from || process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    await this.ses.sendEmail(options).promise();
  }
}
