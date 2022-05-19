import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'My random secret key never let others',
      signOptions: {
        expiresIn: 30,
      },
    }),
    PassportModule,
  ],
  providers: [UsersService,],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
