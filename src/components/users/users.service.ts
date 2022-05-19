import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
  validateUserCredentials(pNumber: string, password: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User) private user: Repository<User>,
  ) {}

  async create(data: any): Promise<User> {
    return this.user.save(data);
}

async findOne(condition: any): Promise<User> {
    return this.user.findOne(condition);
}

}
