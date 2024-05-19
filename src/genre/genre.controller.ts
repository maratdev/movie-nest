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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../user/pipes/id.validation.pipes';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';

@UsePipes(new ValidationPipe())
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('slug/:slug')
  getSlug(@Param('slug', IdValidationPipe) slug: string) {
    return this.genreService.bySlug(slug);
  }

  @Get('collection')
  getCollection() {
    return this.genreService.getCollection();
  }

  @Get()
  searchGenre(@Query('search') query?: string) {
    return this.genreService.searchGenre(query);
  }

  @Get('/:id')
  getGenres(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.getGenreById(id);
  }

  @Post()
  @HttpCode(200)
  @Auth('admin')
  async createGenre() {
    return this.genreService.createGenre();
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateGenreDto,
  ) {
    return this.genreService.updateGenre(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.deleteGenre(id);
  }
}
