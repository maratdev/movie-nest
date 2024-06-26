import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'genres',
  versionKey: false,
  timestamps: true,
})
export class GenreModel extends Document {
  @Prop({
    maxlength: 50,
  })
  name: string;

  @Prop()
  description: string;

  @Prop()
  slug: string;

  @Prop()
  icon: string;
}

export const GenreSchema = SchemaFactory.createForClass(GenreModel);
