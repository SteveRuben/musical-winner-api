import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // Serveur STUN gratuit de Google
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }, // Serveur STUN de Twilio
    // Ajoutez un serveur TURN si nécessaire (nécessite des credentials)
  ],
};

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any): void {
    this.server.emit('offer', data);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any): void {
    this.server.emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: any): void {
    this.server.emit('ice-candidate', data);
  }
}