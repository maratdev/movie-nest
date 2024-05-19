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
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';

@UsePipes(new ValidationPipe())
@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('slug/:slug')
  getSlug(@Param('slug', IdValidationPipe) slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get('collection')
  getCollection() {
    return this.actorService.getCollection();
  }

  @Get()
  searchActor(@Query('search') query?: string) {
    return this.actorService.searchActor(query);
  }

  @Get('/:id')
  getActors(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.getActorById(id);
  }

  @Post()
  @HttpCode(200)
  async createActor() {
    return this.actorService.createActor();
  }

  @Patch(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateActor(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: CreateActorDto,
  ) {
    return this.actorService.updateActor(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteActor(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.deleteActor(id);
  }
}
