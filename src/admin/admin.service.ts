import { th } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma:PrismaService){}
  // async create(name:string,email_Id:string,password:string,role:string){
  //   const user =await this.prisma.user.create({
  //     data:{ name,email_Id,password,role:"Admin"}
  //   })
  //   console.log('gfcg')
  //   return  user
    
  // }

  async find(email_Id:string):Promise<User | null>{
    return await this.prisma.user.findFirst({
      where: {email_Id:email_Id},
    })
  }

  async changeStatus(id:number,approved:boolean){
    return await this.prisma.articles.update({
      where:{id:id},
      data:{approved},
    })

  }
}
