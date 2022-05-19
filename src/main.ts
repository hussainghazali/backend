import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Staywo Backend')
  .setDescription('Backend API Testing')
  .setVersion('1.0')
  .addTag('Hussain Ghazali')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => app.close());
}
}

bootstrap();
