import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActorModel } from './models/actor.model';
import { CreateActorDto } from './dto/create-actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel.name)
    private readonly actorModel: Model<ActorModel>,
  ) {}

  async bySlug(slug: string) {
    return this.actorModel.findOne({ slug }).exec();
  }

  async searchActor(search: string) {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
        ],
      };
    }
    return this.actorModel
      .aggregate()
      .match(query)
      .lookup({
        from: 'movies',
        foreignField: 'actors',
        localField: '_id',
        as: 'movies',
      })
      .addFields({ countMovies: { $size: '$movies' } })
      .project({ updatedAt: 0, createdAt: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getCollection() {
    return this.searchActor('');
  }

  // ------------------------ Admin panel ------------------------/
  async getActorById(_id: string) {
    const actor = await this.actorModel.findById(_id);
    if (!actor) throw new NotFoundException('Genre not found!');
    return actor;
  }

  async createActor(body: CreateActorDto) {
    const actor = await this.actorModel.create(body);
    return actor._id;
  }

  async updateActor(_id: string, dto: CreateActorDto) {
    const updateActor = await this.actorModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();
    if (!updateActor) throw new NotFoundException('Genre not found!');
    return updateActor;
  }

  async deleteActor(_id: string) {
    const deleteActor = await this.actorModel.findByIdAndDelete(_id).exec();
    if (!deleteActor) throw new NotFoundException('Genre not found!');
    return deleteActor;
  }
}
