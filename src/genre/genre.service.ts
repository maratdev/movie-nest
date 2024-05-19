import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GenreModel } from './models/genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { MovieService } from '../movie/movie.service';
import { IGenre } from './interfaces/genre.interfaces';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel.name)
    private readonly genreModel: Model<GenreModel>,
    private readonly movieService: MovieService,
  ) {}

  async bySlug(slug: string) {
    return this.genreModel.findOne({ slug }).exec();
  }

  async searchGenre(search?: string): Promise<GenreModel[]> {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
        ],
      };
    }
    return this.genreModel.find(query).sort({ createdAt: 'desc' }).exec();
  }

  async getCollection(): Promise<IGenre[]> {
    const genres = await this.searchGenre();
    return await Promise.all(
      genres.map(async (genre) => {
        const movies = await this.movieService.byGenres([genre._id.toString()]);
        const result: IGenre = {
          _id: genre._id.toString(),
          image: movies[0]?.bigPoster,
          slug: genre.slug,
          title: genre.name,
        };
        return result;
      }),
    );
  }

  // ------------------------ Admin panel ------------------------/
  async getGenreById(_id: string) {
    const genre = await this.genreModel.findById(_id);
    if (!genre) throw new NotFoundException('Genre not found!');
    return genre;
  }

  async createGenre(): Promise<Types.ObjectId> {
    const defaultValue: CreateGenreDto = {
      description: '',
      icon: '',
      name: '',
      slug: '',
    };
    const genre = await this.genreModel.create(defaultValue);
    return genre._id;
  }

  async updateGenre(_id: string, dto: CreateGenreDto) {
    const updateGenre = await this.genreModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();
    if (!updateGenre) throw new NotFoundException('Genre not found!');
    return updateGenre;
  }

  async deleteGenre(_id: string) {
    const deleteGenre = await this.genreModel.findByIdAndDelete(_id).exec();
    if (!deleteGenre) throw new NotFoundException('Genre not found!');
    return deleteGenre;
  }
}
