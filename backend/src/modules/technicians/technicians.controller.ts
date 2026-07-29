import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { ListTechniciansQueryDto } from './dto/list-technicians-query.dto';

@Controller('technicians')
export class TechniciansController {
    constructor(private readonly service: TechniciansService) { }

    @Get()
    findAll(@Query() query: ListTechniciansQueryDto) {
        return this.service.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }
}