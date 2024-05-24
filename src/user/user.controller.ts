import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model, Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from './pipes/id.validation.pipes';
import { MongoExceptionFilter } from '../config/filter/mongo-exception.filter';
import { HttpExceptionFilter } from '../config/filter/http-exception.filter';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
@UseFilters(MongoExceptionFilter)
@UseFilters(new HttpExceptionFilter())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  @Get('profile')
  @Auth()
  getProfile(@User('_id') _id: Types.ObjectId) {
    return this.userService.getUserById(_id);
  }

  @Get('profile/favorites')
  @Auth()
  getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavorites(_id);
  }

  @Get('count')
  @Auth('admin')
  getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  @Auth('admin')
  getUsers(@Query('search') query?: string) {
    return this.userService.getAll(query);
  }

  @Get(':id')
  @Auth('admin')
  getUser(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return this.userService.getUserById(id);
  }

  @Patch()
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @User('_id') _id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(_id, body);
  }

  @Patch('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorite(
    @User() user: UserModel,
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
  ) {
    return this.userService.toggleFavorite(movieId, user);
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
