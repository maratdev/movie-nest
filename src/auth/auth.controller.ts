import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokenDto } from './dto/token.dto';
import { MongoExceptionFilter } from '../config/filter/mongo-exception.filter';
import { HttpExceptionFilter } from '../config/filter/http-exception.filter';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(MongoExceptionFilter)
@UseFilters(new HttpExceptionFilter())
@ApiTags('Auth')
@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() userAuth: AuthDto) {
    return this.authService.register(userAuth);
  }

  @Post('jwt')
  @HttpCode(HttpStatus.OK)
  async getNewToken(@Body() token: TokenDto) {
    return this.authService.getNewToken(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userAuth: AuthDto) {
    return this.authService.login(userAuth);
  }
}
