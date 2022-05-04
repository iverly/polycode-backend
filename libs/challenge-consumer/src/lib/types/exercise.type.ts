import { Language } from '@polycode/runner';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  statement: string;
  language: Language;
  defaultSource: string;
}
