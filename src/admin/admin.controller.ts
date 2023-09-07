import { Controller, Post, Body, Patch, Param,Session, UseGuards,NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/user/AuthService';
import { User as UserModel,Articles as ArticleModel } from '@prisma/client';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/user/guards/AdminGuard';
import { UserService } from 'src/user/user.service';

@Controller('admin')
export class AdminController {
  constructor(private authService:AuthService,private adminService:AdminService,private userService:UserService){}

  @Post('/signup')
  createAdmin(@Body( )userData:{name:string,email_Id:string,password:string}):Promise<UserModel>{
      return this.authService.adminsignup(userData.name,userData.email_Id,userData.password)
  }

  @Post('/signin')
    async signin(@Body( )userData:{email_Id:string,password:string},@Session() session:any):Promise<UserModel>{
        const user= await this.authService.signin(userData.email_Id,userData.password)
        console.log(user.id)
        session.id = user.id
        return user
    }

  @Patch('/article/approve/:id')
  @UseGuards(AdminGuard)
  async approveArticle(@Param('id') id:string, @Body() body:{approved:boolean},@Session() session:any):Promise<ArticleModel>{
    const user= await this.userService.findUserById(session.id)
    console.log(user.role)
    if(user.role !== "ADMIN"){
      throw new NotFoundException('You are not authorized to approve the article')
    }
    return this.adminService.changeStatus(parseInt(id),body.approved)
  }
}
