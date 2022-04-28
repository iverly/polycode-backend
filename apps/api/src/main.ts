import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from '@polycode/env';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    app.use(helmet());
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
    const config = new DocumentBuilder()
      .setTitle('PolyCode API')
      .setDescription('Do awesome stuff with PolyCode API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
