import { Module } from '@nestjs/common';
import { GroupController } from './groups.controller';
import { GroupsService } from './groups.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroupController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
