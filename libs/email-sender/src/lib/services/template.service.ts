import { Injectable } from '@nestjs/common';

export interface WelcomeTemplateData {
  username: string;
}

export interface VerifyEmailTokenTemplateData {
  username: string;
  token: string;
}

export interface Template {
  subject: string;
  text: string;
}

@Injectable()
export class TemplateService {
  /**
   * It returns a template object with a subject and a text property
   * @param {WelcomeTemplateData} data - WelcomeTemplateData
   * @returns A template object with a subject and text property.
   */
  getWelcomeTemplate(data: WelcomeTemplateData): Template {
    const template =
      `Welcome to PolyCode, {{username}}!` +
      `\n\n` +
      `We are glad to have you on board.` +
      `\n\n` +
      `Thank you for using our website.`;

    return {
      subject: 'Welcome to PolyCode',
      text: this.computeTemplate(template, { ...data }),
    };
  }

  /**
   * It takes a data object and returns a template object
   * @param {VerifyEmailTokenTemplateData} data - VerifyEmailTokenTemplateData
   * @returns A template object with a subject and text property.
   */
  getUserVerifyEmailTemplate(data: VerifyEmailTokenTemplateData): Template {
    const template =
      `Hello, {{username}}!` +
      `\n\n` +
      `Please click the link below to verify your email address.` +
      `\n\n` +
      `${process.env.PUBLIC_WWW_URL}/verify-email/{{token}}` +
      `\n\n` +
      `Thank you for using our website.`;

    return {
      subject: 'Verify your email address - PolyCode',
      text: this.computeTemplate(template, { ...data }),
    };
  }

  /**
   * It takes a template string and a data object, and returns a string with the template's
   * placeholders replaced with the corresponding values from the data object
   * @param {string} template - The template string to be used.
   * @param data - Record<string, string | number>
   * @returns A string with the template replaced with the data.
   */
  computeTemplate(
    template: string,
    data: Record<string, string | number>
  ): string {
    return template.replace(/\{\{(.*?)\}\}/g, (match, p1) => {
      return `${data[p1]}` || `[missing ${match} value]`;
    });
  }
}
