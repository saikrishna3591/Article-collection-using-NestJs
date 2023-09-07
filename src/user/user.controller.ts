import { Controller,  Get, Post, Body, Param, Query,Session,UseGuards,NotFoundException } from '@nestjs/common';
import { User as UserModel,Prisma, Articles as ArticleModel } from '@prisma/client';
import { AuthService } from './AuthService';
import { UserService } from './user.service';
import { AuthGuard } from './guards/AuthGuard';
import { AdminGuard } from './guards/AdminGuard';


@Controller('user')
export class UserController {
  constructor(private authService:AuthService,private userService:UserService){}
  @Post('/signup')
  async createUser(@Body( )userData:{name:string,email_Id:string,password:string}):Promise<UserModel>{
    const user = await this.authService.signup(userData.name,userData.email_Id,userData.password)
    return  user
    }

    @Post('/signin')
    async signin(@Body( )userData:{email_Id:string,password:string},@Session() session:any):Promise<UserModel>{
        const user= await this.authService.signin(userData.email_Id,userData.password)
        console.log(user.id)
        session.id = user.id
        return user
    }

    @Post('/signout')
    async signout(@Session() session:any){
        session.id = null
    }

    @Post('/articles/create')
    @UseGuards(AuthGuard)
    async createArticle(@Body() body:{title:string,description:string},@Session() session:any):Promise<ArticleModel>{
        const user= await this.userService.findUserById(session.id)
        console.log('hi',user.role)
        if(user.role !== 'AUTHOR'){
            throw new NotFoundException('You dont have access to create an article')
        }
        const {title,description}=body
        return this.userService.createArticle({
                    title,
                    description,
                    user:{
                        connect:{id:user.id}
                    }
                })
    }

    @Get('/article')
    @UseGuards(AdminGuard)
    getArticles(@Query('approved') approved:String){
        return this.userService.getUnApprovedArticles(approved)
    }

    @Get('/articles')
    getAllArticles(){
        return this.userService.getAllArticles()
    }

    @Get('/articles')
    getArticlesByAuthor(@Query('author') author:string){
        return this.userService.getArticlesByAuthor(author)
    }
}
