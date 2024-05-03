import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RatingModel } from './models/rating.model';
import { MovieService } from '../movie/movie.service';
import { RatingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel.name)
    private readonly ratingModel: Model<RatingModel>,
    private readonly movieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((result) => (result ? result.value : 0));
  }

  async getAverageRatingByMovie(movieId: Types.ObjectId) {
    return this.ratingModel
      .aggregate([
        { $match: { movieId } },
        { $group: { _id: '$movieId', average: { $avg: '$value' } } },
      ])
      .exec()
      .then((result) => (result ? result[0].average : 0));
  }

  async setRating(userId: Types.ObjectId, dto: RatingDto) {
    const { movieId, value } = dto;
    const newRating = await this.ratingModel
      .findOneAndUpdate(
        {
          movieId,
          userId,
        },
        {
          movieId,
          userId,
          value,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
    const averageRating = await this.getAverageRatingByMovie(movieId);
    await this.movieService.updateRating(movieId, averageRating);
    return newRating;
  }
}
