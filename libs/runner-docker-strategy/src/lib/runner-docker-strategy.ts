import { AbstractRunnerStrategy, Language } from '@polycode/runner';
import { defaults } from 'lodash';
import * as Docker from 'dockerode';
import { DockerRunner } from './runner-docker';

export interface DockerRunnerStrategyOptions {
  images?: LanguageImage[];
}

export interface LanguageImage {
  language: Language;
  image: string;
}

export class RunnerDockerStrategy extends AbstractRunnerStrategy {
  private _docker!: Docker;
  private options: DockerRunnerStrategyOptions;

  constructor(options: DockerRunnerStrategyOptions = {}) {
    super();
    this.options = defaults(options, {
      images: [
        {
          language: Language.JAVA,
          image: 'polycode/java-runner',
        },
        {
          language: Language.JAVASCRIPT,
          image: 'polycode/javascript-runner',
        },
        {
          language: Language.PYTHON,
          image: 'polycode/python-runner',
        },
        {
          language: Language.RUST,
          image: 'polycode/rust-runner',
        },
      ],
    } as DockerRunnerStrategyOptions);
  }

  /**
   * The function initializes the Docker class, pings the Docker daemon, and sets the runner to a new
   * instance of the RunnerDocker class
   */
  async init(): Promise<void> {
    this._docker = new Docker();
    await this._docker.ping();
    // await this.pullImages();
    this.setRunner(new DockerRunner(this._docker, this.options));
  }

  /**
   * It pulls the images specified in the options
   */
  async pullImages() {
    for (const image of this.options.images || []) {
      await this._docker.pull(image.image);
    }
  }
}
