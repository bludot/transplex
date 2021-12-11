import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

import { ServerConfig } from './server.config'

export function setup(app: INestApplication, config: ServerConfig): void {
  const options: Omit<
    OpenAPIObject,
    'components' | 'paths'
  > = new DocumentBuilder()
    .setTitle('Auth API')
    .setVersion(config.SERVICE_VERSION)
    .addBearerAuth()
    .addServer(`http://localhost:${config.PORT}/`)
    .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('api', app, document)
}
