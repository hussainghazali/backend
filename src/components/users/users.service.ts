import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqModel } from '../users/models/registration.req.model';
import { RegistrationRespModel } from '../users/models/registration.resp.model';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from '../users/models/current.user';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { UpdateUser } from './models/update.user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private async registrationValidation(
    regModel: RegistrationReqModel,
  ): Promise<string> {
    if (!regModel.pNumber) {
      return "PJO Number can't be empty";
    }

    const user = await this.user.findOne({ pNumber: regModel.pNumber });
    if (user != null && user.pNumber) {
      return 'PJO Number already exist';
    }

    if (regModel.password !== regModel.confirmPassword) {
      return 'Confirm password not matching';
    }
    return '';
  }

  private async getPasswordHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async registerUser(
    regModel: RegistrationReqModel,
  ): Promise<RegistrationRespModel> {
    let result = new RegistrationRespModel();

    const errorMessage = await this.registrationValidation(regModel);
    if (errorMessage) {
      result.message = errorMessage;
      result.successStatus = false;

      return result;
    }

    let newUser = new User();
    newUser.name = regModel.name;
    newUser.role = regModel.role;
    newUser.unit = regModel.unit;
    newUser.pNumber = regModel.pNumber;
    newUser.password = await this.getPasswordHash(regModel.password);

    await this.user.insert(newUser);
    result.successStatus = true;
    result.message = 'succeess';
    return result;
  }

  public async validateUserCredentials(
    pNumber: string,
    password: string,
  ): Promise<CurrentUser> {
    let user = await this.user.findOne({ pNumber: pNumber });

    if (user == null) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    let currentUser = new CurrentUser();
    currentUser.userId = user.userId;
    currentUser.name = user.name;
    currentUser.role = user.role;
    currentUser.unit = user.unit;
    currentUser.pNumber = user.pNumber;

    return currentUser;
  }

  public async getJwtToken(user: CurrentUser): Promise<string> {
    const payload = {
      ...user,
    };
    return this.jwtService.signAsync(payload);
  }

  public async getRefreshToken(userId: number): Promise<string> {
    const userDataToUpdate = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment().day(1).format('YYYY/MM/DD'),
    };

    await this.user.update(userId, userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async getUsersBypNumber(pNumber: string): Promise<User> {
    let user = await this.user.findOne({pNumber});
    if (!user) {
      throw new NotFoundException('User not found from DMC Database');
    }
    return user;
  }

  public async getUsersByCookies(refreshToken: string): Promise<User> {
    let user = await this.user.findOne({refreshToken});
    if(!user) {
      throw new NotFoundException('User not found from DMC Database');
    }
    return user;
  }

  public async validRefreshToken(
    pNumber: string,
    refreshToken: string,
  ): Promise<CurrentUser> {
    const currentDate = moment().day(1).format('YYYY/MM/DD');
    let user = await this.user.findOne({
      where: {
        pNumber: pNumber,
        refreshToken: refreshToken,
        refreshTokenExp: MoreThanOrEqual(currentDate),
      },
    });

    if (!user) {
      return null;
    }

    let currentUser = new CurrentUser();
    currentUser.userId = user.userId;
    currentUser.name = user.name;
    currentUser.role = user.role;
    currentUser.unit = user.unit;
    currentUser.pNumber = user.pNumber;

    return currentUser;
  }

  public async getUsers(): Promise<User[]> {
    return await this.user.find();
  }

  public async getUsersById(userId: number): Promise<User> {
    let users = await this.user.findOne(userId);
    if (!users) {
      throw new NotFoundException('User not found from DMC Database');
    }
    return users;
  }

  async updateUser(oldUser: CurrentUser, updated_values: UpdateUser): Promise<User> {
    const updatedUser = oldUser;
    Object.keys(updated_values).forEach((key) => {
      updatedUser[key] = updated_values[key];
    });
    try {
      return await this.user.save(updatedUser);
    } catch (err) {
      return err;
    }
}

  public async deleteUser(userId: number): Promise<void> {
    await this.user.delete(userId);
  }

}
