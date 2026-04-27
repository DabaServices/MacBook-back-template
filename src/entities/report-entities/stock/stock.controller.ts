import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { StockService } from './stock.service';

@Controller('/stocks')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get('')
  async getUnitStocks(
    @Headers('materialid') materialId: string,
    @Headers('materialgroup') materialGroup: string,
    @Headers('rootunit') rootUnit: Number,
    @Req() request: Request,
  ) {
    return this.service.getMaterialStocks(
      rootUnit,
      request?.['date'],
      materialId,
      materialGroup,
    );
  }
}
