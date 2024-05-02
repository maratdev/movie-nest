import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreModel, GenreSchema } from './models/genre.model';

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
  ],
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
