import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookService {
  getHello(): string {
    return 'Hello World!';
  }
}