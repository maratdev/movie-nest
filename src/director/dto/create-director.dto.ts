import { IsOptional, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  photo: string;
}
