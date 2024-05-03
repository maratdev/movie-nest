import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingModel, RatingSchema } from './models/rating.model';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: RatingModel.name,
        useFactory: () => {
          return RatingSchema;
        },
      },
    ]),
    MovieModule,
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
