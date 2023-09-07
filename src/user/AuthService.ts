import {Injectable,BadRequestException,NotFoundException} from '@nestjs/common'
import { UserService } from './user.service'
import { AdminService } from 'src/admin/admin.service'
import { randomBytes,scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService{
  constructor(private userService: UserService,private adminService:AdminService){}

  async signup(name:string,email_Id:string,password:string){
    //see if email in use
    // const users = await this.userService.find(email)
    // if(users.email_Id.length){
    //   throw new BadRequestException('email in use')
    // }

    //Hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex')

    //Hash the salt and the password together
    const hash = (await scrypt(password,salt,32)) as Buffer

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex')

    //create a new user and save it
    const user = this.userService.create(name,email_Id,result)

    //return the user
    return user
  }

  async adminsignup(name:string,email_Id:string,password:string){
    //see if email in use
    // const users = await this.userService.find(email)
    // if(users.email_Id.length){
    //   throw new BadRequestException('email in use')
    // }

    //Hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex')

    //Hash the salt and the password together
    const hash = (await scrypt(password,salt,32)) as Buffer

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex')

    //create a new user and save it
    const user = this.userService.createUser({name,email_Id,password:result,role:"ADMIN"})

    //return the user
    return user
  }

  async signin(email_Id:string,password:string){
    const users= await this.userService.find(email_Id)
    if(!users.email_Id){
      throw new NotFoundException('user not found')
    }

    const [salt,storedHash] = users.password.split('.')

    const hash = (await scrypt(password,salt,32)) as Buffer

    if(storedHash !== hash.toString('hex')){
       throw new BadRequestException('Bad password')
    }
    return users
  }
}