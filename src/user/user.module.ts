import { Module,MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from './AuthService';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService,AdminService,AuthService,PrismaService]
})
export class UserModule {}
