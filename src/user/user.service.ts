import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { User, Articles,Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  async create(name:string,email_Id:string,password:string,role?:string){
    return await this.prisma.user.create({
      data:{ name,email_Id,password}
    })
  }

  async createUser(data: Prisma.UserCreateInput):Promise<User>{
    return await this.prisma.user.create({data})
  }

  async find(email_Id:string):Promise<User | null>{
    return await this.prisma.user.findFirst({
      where: {email_Id:email_Id},
    })
  }

  async createArticle(data:Prisma.ArticlesCreateInput):Promise<Articles>{
      return await this.prisma.articles.create({ data })
    }

    async getUnApprovedArticles(approved){
      console.log(approved)
      return await this.prisma.articles.findMany({
        where: {
          approved: false 
        },
      });
    }

    getAllArticles(){
      return this.prisma.articles.findMany();
    }

    getArticlesByAuthor(author){
      return this.prisma.articles.findMany({
        where:{author_Id:parseInt(author)}
      })
    }
    async findUserById(id:number){
      console.log(id)
      if(!id){
        return null
      }
      return await this.prisma.user.findUnique({where:{id}})
    }
}
