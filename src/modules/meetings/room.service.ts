import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomRepository } from './repositories/room.repository';
import { Room } from '@prisma/client';


interface RoomState {
  // Définissez ici les propriétés de l'état de la room
  [key: string]: any;
}

/* export interface Room {
  id: string;
  displayName: string;
  urlId: string;
  state: RoomState;
  serialize(): Promise<any>;
} */

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getRoomByRoute(roomRoute: string): Promise<Room | null> {
    try {
      return await this.roomRepository.findByRoute(roomRoute);
    } catch (error) {
      this.logger.error(`Error finding room by route: ${roomRoute}`, error.stack);
      return null;
    }
  }

  async createRoom(
    template: any,
    accountId: string | null,
    sessionId: string | null,
    templateName: string,
  ): Promise<Room> {
    try {
      // Créer la room avec son état initial
      const { room, state } = await this.roomRepository.createFromTemplate(
        templateName,
        template,
        accountId
      );

      // Émettre l'événement de création
      if (accountId && sessionId) {
        this.eventEmitter.emit('room.created', {
          accountId,
          sessionId,
          templateName,
          roomId: room.id,
        });
      }

      // Retourner la room avec son état
      return this.createRoomWithState(room, state);
    } catch (error) {
      this.logger.error(
        `Error creating room from template: ${templateName}`,
        error.stack
      );
      throw error;
    }
  }

  async revokeMembership(roomId: string, actorId: string): Promise<void> {
    try {
      await this.roomRepository.revokeMembership(roomId, actorId);
      this.eventEmitter.emit('room.membership.revoked', { roomId, actorId });
    } catch (error) {
      this.logger.error(
        `Error revoking membership for actor ${actorId} in room ${roomId}`,
        error.stack
      );
      throw error;
    }
  }

  getUrlName(displayName: string): string {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private createRoomWithState(room: any, state: RoomState): Room {
    return {
      ...room,
      state,
      async serialize() {
        return {
          id: this.id,
          displayName: this.displayName,
          urlId: this.urlId,
          state: this.state,
          // Ajoutez d'autres propriétés nécessaires
        };
      },
    };
  }
}