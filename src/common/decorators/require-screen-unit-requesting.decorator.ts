import { applyDecorators, UseGuards } from '@nestjs/common';
import { ScreenUnitRequestingGuard } from '../guards/screen-unit-requesting.guard';

export const RequireScreenUnitRequesting = () =>
  applyDecorators(UseGuards(ScreenUnitRequestingGuard));
