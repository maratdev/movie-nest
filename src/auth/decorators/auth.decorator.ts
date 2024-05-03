import { TypeRole } from '../interfaces/auth.interface';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/admin.guard';

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, RolesGuard)
      : UseGuards(JwtAuthGuard),
  );
