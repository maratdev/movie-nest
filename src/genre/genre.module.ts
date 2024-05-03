import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreModel, GenreSchema } from './models/genre.model';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: GenreModel.name,
        useFactory: () => {
          return GenreSchema;
        },
      },
    ]),
    MovieModule,
  ],
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
