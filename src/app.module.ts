import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './components/users/user.entity';
import { UsersModule } from './components/users/users.module';
import { FilesModule } from './components/fileUploads/files.module';
import { HttpErrorFilter } from './logs/http-error.filter';
import { LoggingInterceptor } from './logs/logging.interceptor';



// code hidden for display purpose
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port: 3306,
      username: 'root',
      password:'Server"2021',
      database:'staywo',
      entities:[User,],
    }),
    UsersModule,
    FilesModule,
  ],
  controllers:[AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
],
})
export class AppModule {}
