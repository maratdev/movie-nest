import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorModel, ActorSchema } from './models/actor.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ActorModel.name,
        useFactory: () => {
          return ActorSchema;
        },
      },
    ]),
  ],
  providers: [ActorService],
  controllers: [ActorController],
})
export class ActorModule {}
