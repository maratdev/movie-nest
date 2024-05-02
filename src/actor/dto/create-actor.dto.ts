import { IsOptional, IsString } from 'class-validator';

export class CreateActorDto {
  @IsString()
  name: string;

  @IsString()
  slug?: string;

  @IsOptional()
  photo?: string;
}
