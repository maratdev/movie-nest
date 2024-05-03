import { Types } from 'mongoose';
import { IsMongoId, IsNumber } from 'class-validator';

export class RatingDto {
  @IsMongoId()
  movieId: Types.ObjectId;
  @IsNumber()
  value: number;
}
