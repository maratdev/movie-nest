import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { USER } from './constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async getUserById(_id: Types.ObjectId): Promise<UserModel> {
    const user = await this.userModel.findById(_id);
    if (!user) throw new NotFoundException(USER.NOT_FOUND);
    return user;
  }

  async updateUser(_id: Types.ObjectId, dto: UpdateUserDto): Promise<void> {
    const user = await this.getUserById(_id);
    if (dto.password !== '') {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    if (dto.email !== user.email) {
      await this.checkDuplicateUser(dto.email);
    }
    user.email = dto.email;
    if (dto.role || dto.role === false) user.role = dto.role;

    await user.save();
  }

  async getCount() {
    return this.userModel.find().countDocuments().exec();
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

  async toggleFavorite(movieId, user: UserModel) {
    const { favorites, _id } = user;
    await this.userModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => String(id) !== String(movieId))
        : [...favorites, movieId],
    });
  }

  async getFavorites(_id: Types.ObjectId) {
    return this.userModel
      .findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        model: 'MovieModel',
        populate: {
          path: 'actors',
          model: 'ActorModel',
        },
      })
      .populate({
        path: 'favorites',
        model: 'MovieModel',
        populate: {
          path: 'genres',
          model: 'GenreModel',
        },
      })
      .exec()
      .then((data) => data.favorites);
  }

  //--------------------- Вспомогательные методы --------------------/
  private async checkDuplicateUser(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new ConflictException(USER.DUPLICATE);
    }
    return !!user;
  }
}
