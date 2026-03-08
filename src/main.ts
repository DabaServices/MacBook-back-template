import { NestFactory } from '@nestjs/core';
import { AppModule } from './appModule.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HeadersMiddeware } from './common/middlewares/headers';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

const https = require('https')
https.globalAgent = new https.Agent({
  ca: process.env.CERIFICATE_CA
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - allow frontend requests
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  // Body parser
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Global middleware
  app.use(new HeadersMiddeware().use.bind(new HeadersMiddeware()));

  // Global interceptors and filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
