import { Injectable } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}
  async register(user: any) {
    return this.userModel.create(user);
  }
}
