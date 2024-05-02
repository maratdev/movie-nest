import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModel, MovieSchema } from './models/movie.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MovieModel.name,
        useFactory: () => {
          return MovieSchema;
        },
      },
    ]),
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
