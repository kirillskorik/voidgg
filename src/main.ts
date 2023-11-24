import dotenvFlow from 'dotenv-flow'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
    dotenvFlow.config()

    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: '*',
        credentials: true,
    })

    const config = new DocumentBuilder()
        .setTitle('API',)
        .setDescription('Description',)
        .setVersion('1.0',)
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(process.env['PORT'] ?? 80)
}
bootstrap()
