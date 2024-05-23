import { IsBoolean, IsOptional, ValidateIf } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { AuthDto } from '../../auth/dto/auth.dto';

export class UpdateUserDto extends PartialType(AuthDto) {
  @IsOptional()
  @IsBoolean()
  role?: boolean;

  @ValidateIf((obj) => obj.password !== null && obj.password !== '')
  password: string;
}
