import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DirectorModel } from './models/director.model';
import { CreateDirectorDto } from './dto/create-director.dto';

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(DirectorModel.name)
    private readonly directorModel: Model<DirectorModel>,
  ) {}

  async bySlug(slug: string) {
    return this.directorModel.findOne({ slug }).exec();
  }

  async searchDirector(search: string) {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
        ],
      };
    }
    return this.directorModel.aggregate([
      { $match: query },
      { $addFields: { userId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'movies',
          localField: 'userId',
          foreignField: 'directors',
          as: 'movie',
        },
      },
      { $addFields: { countMovies: { $size: '$movie' } } },
      { $project: { __v: 0, updatedAt: 0, movie: 0, userId: 0 } },
      { $sort: { updatedAt: -1 } },
    ]);
  }

  async getCollection() {
    return this.searchDirector('');
  }

  // ------------------------ Admin panel ------------------------/
  async getDirectorById(_id: string) {
    const director = await this.directorModel.findById(_id);
    if (!director) throw new NotFoundException('Genre not found!');
    return director;
  }

  async createDirector(): Promise<Types.ObjectId> {
    const defaultValue: CreateDirectorDto = {
      name: '',
      photo: '',
      slug: '',
    };
    const director = await this.directorModel.create(defaultValue);
    return director._id;
  }

  async updateDirector(_id: string, dto: CreateDirectorDto) {
    const updateDirector = await this.directorModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();
    if (!updateDirector) throw new NotFoundException('Genre not found!');
    return updateDirector;
  }

  async deleteDirector(_id: string) {
    const deleteDirector = await this.directorModel
      .findByIdAndDelete(_id)
      .exec();
    if (!deleteDirector) throw new NotFoundException('Genre not found!');
    return deleteDirector;
  }
}
