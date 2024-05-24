import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectorModel, DirectorSchema } from './models/director.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: DirectorModel.name,
        useFactory: () => {
          return DirectorSchema;
        },
      },
    ]),
  ],
  providers: [DirectorService],
  controllers: [DirectorController],
  exports: [DirectorService],
})
export class DirectorModule {}
