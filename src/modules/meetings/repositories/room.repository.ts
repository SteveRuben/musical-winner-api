import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RoomRepository {
  constructor(private prisma: PrismaService) {}

  async findByRoute(route: string) {
    // Implémentez la logique de recherche avec Prisma
    const room = await this.prisma.room.findFirst({
      where: {
        routes: {
          some: {
            route,
          },
        },
      },
      include: {
        state: true,
      },
    });

    return room;
  }

  async createFromTemplate(
    templateName: string,
    template: any,
    accountId: string | null,
  ) {
    // Implémentez la logique de création avec Prisma
    const room = await this.prisma.room.create({
      data: {
        templateName,
        creatorId: accountId ? parseInt(accountId) : null,
      },
    });

    const state = await this.prisma.roomState.create({
      data: {
        roomId: room.id,
        state: template || {},
      },
    });

    return { room, state };
  }

  async revokeMembership(roomId: string, actorId: string) {
    const membership = await this.prisma.roomMembership.findFirst({
      where: {
        roomId: parseInt(roomId),
        accountId: parseInt(actorId),
      },
    });

    if (membership) {
      await this.prisma.roomMembership.delete({
        where: { id: membership.id },
      });
    }
  }
}
