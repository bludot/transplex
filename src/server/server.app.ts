import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ConfigService } from './../modules/config/config.service'
// import { TransformInterceptor } from '../interceptors/grpc.interceptor'
import { ServerConfig } from './server.config'
import { ServerModule } from './server.module'
import { setup as setupSwagger } from './server.swagger'

export async function start(): Promise<INestApplication> {
  const serverConfig: ConfigService<ServerConfig> = new ConfigService(
    ServerConfig,
  )

  const app: INestApplication = await NestFactory.create(
    ServerModule.forRoot(serverConfig),
    {
      ...(!serverConfig.env.NESTJS_LOGS_ENABLED ? { logger: false } : {}),
    },
  )

  app.use(cookieParser())

  app.enableCors({ origin: 'http://localhost:8080', credentials: true })
  app.useGlobalPipes(new ValidationPipe())
  app.useWebSocketAdapter(new IoAdapter(app)) // Add this line

  setupSwagger(app, serverConfig.env)

  await app.listen(serverConfig.env.PORT, serverConfig.env.HOSTNAME)

  return app
}
