import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Response } from 'express';
  import { CurrentUser } from './models/current.user';
  import { RegistrationReqModel } from './models/registration.req.model';
import { UpdateUser } from './models/update.user';
import { User } from './user.entity';
  import { UsersService } from './users.service';
  
  @Controller('users')
  export class UsersController {
    constructor(private userService: UsersService) {}
  
    @Post('registration')
    async registerUser(@Body() reg: RegistrationReqModel) {
      return await this.userService.registerUser(reg);
    }
  
    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
      const token = await this.userService.getJwtToken(req.user as CurrentUser);
      const refreshToken = await this.userService.getRefreshToken(
        req.user.userId,
      );
      const secretData = {
        token,
        refreshToken,
      };
  
      res.cookie('auth-cookie', secretData, { httpOnly: true });
      return  {msg:'success'};
    }
  
    @Get('refresh-tokens')
    @UseGuards(AuthGuard('refresh'))
    async regenerateTokens(
      @Req() req,
      @Res({ passthrough: true }) res: Response,
    ) {
      const token = await this.userService.getJwtToken(req.user as CurrentUser);
      const refreshToken = await this.userService.getRefreshToken(
        req.user.userId,
      );
      const secretData = {
        token,
        refreshToken,
      };
  
      res.cookie('auth-cookie', secretData, { httpOnly: true });
      return   {msg:'success'};
    }

    
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  public async getUsers(): Promise<User[]> {
    let users = await this.userService.getUsers();
    return users;
  }

  @Get('list/:userId')
  @UseGuards(AuthGuard('jwt'))
  public async getUsersBypNumber(@Param('userId') userId: number) {
    let users = await this.userService.getUsersById(userId);
    return users;
  }

  @Put('update/:userId')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Body() updatedUser: UpdateUser, @Param('userId') userId: number): Promise<User> {
    const oldUser = await this.userService.getUsersById(userId);
    return await this.userService.updateUser(oldUser, updatedUser);
  }

  @Delete('delete/:userId')
  @UseGuards(AuthGuard('jwt'))
  public async deleteUser(@Param('userId') userId: number) {
    let deletedUser = await this.userService.deleteUser(userId);
    return ({msg: 'User has been deleted successfully'});
  }

  @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('auth-cookie');

        return {
            message: 'User has been Logged out successfully'
        }
    }

  }