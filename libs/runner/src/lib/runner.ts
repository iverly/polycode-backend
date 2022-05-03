export enum Language {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  RUST = 'rust',
  JAVA = 'java',
}

export interface CompilerOptions {
  language: Language;
  version: string;
}

export interface Workload {
  id: string;
  source: string;
  compilerOptions: CompilerOptions;
}

export interface WorkloadOutput {
  stdout: string;
  stderr: string;
}

export interface WorkloadResult {
  success: boolean;
  output?: WorkloadOutput;
}
