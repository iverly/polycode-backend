import { Injectable } from '@nestjs/common';

export interface WelcomeTemplateData {
  username: string;
  confirmationLink: string;
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
      `Please click on the following link to confirm your account:` +
      `\n\n` +
      `{{confirmationLink}}` +
      `\n\n` +
      `Thank you for using our website.`;

    return {
      subject: 'Welcome to PolyCode',
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
