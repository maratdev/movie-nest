import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovieModel } from './models/movie.model';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel.name)
    private readonly movieModel: Model<MovieModel>,
  ) {}

  async bySlug(slug: string) {
    return this.movieModel
      .findOne({ slug })
      .populate('directors genres')
      .populate({
        path: 'directors',
        select: 'name slug',
        model: 'DirectorModel',
      })
      .populate({ path: 'genres', model: 'GenreModel' })
      .exec();
  }

  async searchMovie(search: string) {
    let query = {};
    if (search) {
      query = {
        $or: [{ title: { $regex: search, $options: 'i' } }],
      };
    }
    return this.movieModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'directors',
        model: 'DirectorModel',
        select: 'name slug',
      })
      .populate({
        path: 'genres',
        model: 'GenreModel',
        select: '-createdAt -updatedAt',
      })
      .exec();
  }

  async getCollection() {
    return this.searchMovie('');
  }

  async byDirector(directorId: Types.ObjectId) {
    return this.movieModel.find({ directors: directorId }).exec();
  }

  async byGenres(genreIds: Types.ObjectId[]): Promise<MovieModel[]> {
    return this.movieModel.find({ genres: { $in: genreIds } }).exec();
  }

  async updateCountOpened(slug: string) {
    const updateMovie = await this.movieModel
      .findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true })
      .exec();
    if (!updateMovie) throw new NotFoundException('Genre not found!');
    return updateMovie;
  }

  async getPostPopular() {
    return this.movieModel
      .find({ countOpened: { $gt: 0 } }, { lean: false })
      .populate({ path: 'genres', model: 'GenreModel' })
      .sort({ countOpened: -1 })
      .exec();
  }

  async updateRating(_id: Types.ObjectId, newRating: number) {
    return this.movieModel
      .findByIdAndUpdate(_id, { rating: newRating }, { new: true })
      .exec();
  }

  // ------------------------ Admin panel ------------------------/
  async getMovieById(_id: string) {
    const movie = await this.movieModel.findById(_id);
    if (!movie) throw new NotFoundException('Genre not found!');
    return movie;
  }

  async createMovie(): Promise<Types.ObjectId> {
    const defaultValue: CreateMovieDto = {
      bigPoster: '',
      directors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };
    const movie = await this.movieModel.create(defaultValue);
    return movie._id;
  }

  async updateMovie(_id: string, dto: CreateMovieDto) {
    const updateMovie = await this.movieModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();
    if (!updateMovie) throw new NotFoundException('Genre not found!');
    return updateMovie;
  }

  async deleteMovie(_id: string) {
    const deleteMovie = await this.movieModel.findByIdAndDelete(_id).exec();
    if (!deleteMovie) throw new NotFoundException('Genre not found!');
    return deleteMovie;
  }
}
