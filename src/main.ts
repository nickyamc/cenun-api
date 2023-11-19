import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {useContainer} from 'class-validator';
import * as process from "process";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), {fallbackOnErrors: true});
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('CUCS API')
        .setDescription('La descripción de la API de CUCS')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(AppModule.port);
}

bootstrap();
