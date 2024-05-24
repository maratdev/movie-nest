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
import { IdValidationPipe } from '../user/pipes/id.validation.pipes';
import { Auth } from '../auth/decorators/auth.decorator';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';

@UsePipes(new ValidationPipe())
@Controller('director')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Get('slug/:slug')
  getSlug(@Param('slug', IdValidationPipe) slug: string) {
    return this.directorService.bySlug(slug);
  }

  @Get('collection')
  getCollection() {
    return this.directorService.getCollection();
  }

  @Get()
  searchDirector(@Query('search') query?: string) {
    return this.directorService.searchDirector(query);
  }

  @Get('/:id')
  getDirector(@Param('id', IdValidationPipe) id: string) {
    return this.directorService.getDirectorById(id);
  }

  @Post()
  @HttpCode(200)
  async createDirector() {
    return this.directorService.createDirector();
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateDirector(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateDirectorDto,
  ) {
    return this.directorService.updateDirector(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteDirector(@Param('id', IdValidationPipe) id: string) {
    return this.directorService.deleteDirector(id);
  }
}
