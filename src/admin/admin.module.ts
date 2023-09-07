import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/user/AuthService';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,AuthService,PrismaService,UserService]
})
export class AdminModule {}

