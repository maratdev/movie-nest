import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'directors',
  versionKey: false,
  timestamps: true,
})
export class DirectorModel extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  photo: string;
}

export const DirectorSchema = SchemaFactory.createForClass(DirectorModel);
