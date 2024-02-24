import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

interface RoleCondition {
  ownerId?: number;
  admins?: {
    some: {
      id: number;
    };
  };
  participants?: {
    some: {
      id: number;
    };
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const channelId = +request.params.id;
    if (!channelId) {
      throw new BadRequestException('Channel ID is required');
    }

    const conditions: RoleCondition[] = [];

    if (roles.includes('owner')) {
      conditions.push({ ownerId: request.user.id });
    }

    if (roles.includes('admin')) {
      conditions.push({
        admins: {
          some: {
            id: request.user.id,
          },
        },
      });
    }

    if (roles.includes('user')) {
      conditions.push({
        participants: {
          some: {
            id: request.user.id,
          },
        },
      });
    }

    let isAllowed = false;

    isAllowed = await this.prisma.conversation
      .findFirst({
        where: {
          id: channelId,
          OR: conditions,
        },
      })
      .then((channel) => (channel ? true : false));

    return isAllowed;
  }
}
