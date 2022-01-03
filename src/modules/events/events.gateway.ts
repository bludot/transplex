import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { EventType } from './event.types'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server
  wsClients = []
  afterInit() {
    console.log('init')
    this.server.emit('testing', { do: 'stuff' })
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('connecting', args)
    this.wsClients.push(client)
    this.broadcast('connection', { connected: true })
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1)
        break
      }
    }
    // this.broadcast('disconnect', {})
  }

  private broadcast(event, message: any) {
    const broadCastMessage = JSON.stringify(message)
    return this.server.emit(event, message)
  }

  async sendEvent(event: EventType, data: any) {
    this.broadcast(event, data)
  }
}
