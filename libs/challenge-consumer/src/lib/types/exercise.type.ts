import { Language } from '@polycode/runner';
import { Module } from './module.type';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  statement: string;
  language: Language;
  defaultSource: string;
  module?: Module;
}
