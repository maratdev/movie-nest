import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './models/user.model';
import { Model } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from './pipes/id.validation.pipes';

@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  @Get('profile')
  @Auth()
  getProfile(@User('_id') _id: string) {
    return this.userService.getUserById(_id);
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
  getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Patch()
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(_id, body);
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
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
