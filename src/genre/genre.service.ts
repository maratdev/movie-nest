import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenreModel } from './models/genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel.name)
    private readonly genreModel: Model<GenreModel>,
  ) {}

  async bySlug(slug: string) {
    return this.genreModel.findOne({ slug }).exec();
  }

  async searchGenre(search: string) {
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
    return this.genreModel.find(query).sort({ createdAt: 'desc' });
  }

  async getCollection() {
    return this.searchGenre('');
  }

  // ------------------------ Admin panel ------------------------/
  async getGenreById(_id: string) {
    const genre = await this.genreModel.findById(_id);
    if (!genre) throw new NotFoundException('Genre not found!');
    return genre;
  }

  async createGenre(body: CreateGenreDto) {
    const genre = await this.genreModel.create(body);
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
