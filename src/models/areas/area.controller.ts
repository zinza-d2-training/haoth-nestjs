import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AreaService } from './area.service';

@Controller()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('provinces')
  async findAll() {
    return await this.areaService.findAllProvince();
  }

  @Get('provinces/p/:id')
  async findDistricts(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.areaService.findDistricts(id);
  }

  @Get('provinces/d/:id')
  async findWards(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.areaService.findWards(id);
  }
}
