import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async getUserById(_id: string) {
    const user = await this.userModel.findById(_id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async updateUser(_id: string, dto: UpdateUserDto) {
    const user = await this.getUserById(_id);
    const isSameUser = await this.userModel.findById({ _id });
    if (isSameUser && String(_id) !== String(isSameUser._id))
      throw new NotFoundException('Email already exists!');
    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    if (dto.role || dto.role === false) user.role = dto.role;
    await user.save();
  }

  async getCount() {
    return this.userModel.find().countDocuments();
  }

  async getAll(search: string) {
    let query = {};
    if (search) {
      query = {
        $or: [{ email: { $regex: search, $options: 'i' } }],
      };
    }
    return this.userModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .select('-password');
  }

  async deleteUser(_id: string) {
    return this.userModel.findByIdAndDelete(_id).exec();
  }
}
