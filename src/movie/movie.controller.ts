import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../user/pipes/id.validation.pipes';
import { Auth } from '../auth/decorators/auth.decorator';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Types } from 'mongoose';
import { MongoExceptionFilter } from '../config/filter/mongo-exception.filter';
import { HttpExceptionFilter } from '../config/filter/http-exception.filter';
import { ApiTags } from '@nestjs/swagger';

@UsePipes(new ValidationPipe())
@UseFilters(MongoExceptionFilter)
@UseFilters(new HttpExceptionFilter())
@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('slug/:slug')
  getSlug(@Param('slug', IdValidationPipe) slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('director/:directorId')
  byDirectorId(
    @Param('directorId', IdValidationPipe) directorId: Types.ObjectId,
  ) {
    return this.movieService.byDirector(directorId);
  }

  @Post('genre')
  @HttpCode(200)
  byGenre(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return this.movieService.byGenres(genreIds);
  }

  @Get()
  searchMovie(@Query('search') query?: string) {
    return this.movieService.searchMovie(query);
  }

  @Get('popular')
  searchPostPopular() {
    return this.movieService.getPostPopular();
  }

  @Get('/:id')
  getMovie(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.getMovieById(id);
  }

  @Patch('update')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  // ------------------ Admin ------------------ /

  @Auth('admin')
  @Post()
  @HttpCode(200)
  async createMovie() {
    return this.movieService.createMovie();
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateMovie(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateMovieDto,
  ) {
    return this.movieService.updateMovie(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteMovie(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.deleteMovie(id);
  }
}
