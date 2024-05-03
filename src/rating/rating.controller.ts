import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { RatingService } from './rating.service';
import { IdValidationPipe } from '../user/pipes/id.validation.pipes';
import { RatingDto } from './dto/rating.dto';

@UsePipes(new ValidationPipe())
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @Post('set')
  @Auth()
  setRating(@User('_id') _id: Types.ObjectId, @Body() dto: RatingDto) {
    return this.ratingService.setRating(_id, dto);
  }
}
