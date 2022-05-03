import { AbstractRunner, Workload, WorkloadResult } from '@polycode/runner';
import { DockerRunnerStrategyOptions } from './runner-docker-strategy';
import * as Docker from 'dockerode';
import { PassThrough, Stream } from 'stream';

export class DockerRunner extends AbstractRunner {
  private docker: Docker;
  private options: DockerRunnerStrategyOptions;

  constructor(docker: Docker, options: DockerRunnerStrategyOptions) {
    super();
    this.docker = docker;
    this.options = options;
  }

  /**
   * It creates a container, starts it, listens to its output, and then removes it
   * @param {Workload} workload - Workload
   * @returns A promise that resolves to a WorkloadResult
   */
  async run(workload: Workload): Promise<WorkloadResult> {
    const image = this.findImage(workload.compilerOptions.language);

    if (!image) {
      throw new Error(
        `No image found for language ${workload.compilerOptions.language}`
      );
    }

    /* Creating a container, starting it, and then returning the container. */
    const container = await this.docker.createContainer({
      Image: image,
      Tty: true,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        ReadonlyPaths: ['/proc', '/sys', '/dev', '/root', '/etc'],
      },
      Env: [
        `COMPILER_OPTIONS_LANGUAGE=${workload.compilerOptions.language}`,
        `COMPILER_OPTIONS_VERSION=${workload.compilerOptions.version}`,
        `SOURCE_CODE=${workload.source}`,
      ],
    });
    await container.start();

    /* Setting a timeout of 60 seconds. If the container is still running after 60 seconds, it will be
    killed. */
    const timeout = setTimeout(() => {
      container.kill();
    }, 1000 * 60);
    const statusCode = await this.waitContainerDie(container);
    clearTimeout(timeout);

    /* Getting the output of the container and parsing it. */
    const output = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });
    const { stdout, stderr } = this.parseOutput(output.toString());

    await container.remove({ force: true });
    return {
      success: !statusCode,
      output: {
        stdout,
        stderr,
      },
    };
  }

  /**
   * It waits for a container to die and returns the exit code
   * @param container - Docker.Container - The container object returned by the dockerode library.
   * @returns A promise that resolves to the exit code of the container.
   */
  waitContainerDie(container: Docker.Container): Promise<number> {
    return new Promise((resolve, reject) => {
      container.wait((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.StatusCode || 0);
        }
      });
    });
  }

  /**
   * It takes the output of a program and returns the stdout and stderr as separate strings
   * @param {string} stdout - The output of the command.
   * @returns The stdout and stderr of the command.
   */
  parseOutput(stdout: string): { stdout: string; stderr: string } {
    const stdoutStart = stdout.indexOf('$::stdout::$');
    const stdoutEnd = stdout.indexOf('$::stderr::$');
    return {
      stdout: stdout
        .substring(stdoutStart + 13, stdoutEnd)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n'),
      stderr: stdout
        .substring(stdoutEnd + 13)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n'),
    };
  }

  /**
   * If the language is found in the images array, return the image, otherwise return null.
   * @param {string} language - The language of the image to find.
   * @returns The image for the language.
   */
  findImage(language: string): string | null {
    for (const image of this.options.images || []) {
      if (image.language === language) {
        return image.image;
      }
    }
    return null;
  }

  /**
   * It takes a stream, pipes it to a buffer, and returns a promise that resolves to the string
   * contents of the buffer
   * @param {Stream} stream - Stream - The stream to listen to.
   * @returns A promise that resolves to a string.
   */
  listenOutput(stream: Stream): Promise<string> {
    return new Promise((resolve) => {
      const buffer = new PassThrough();
      buffer.setEncoding('utf8');
      stream.pipe(buffer);
      stream.on('end', () => {
        console.log('end');
        resolve(buffer.read());
      });
    });
  }
}
