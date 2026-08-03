import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAccessGuard)
@Controller('addresses')
export class AddressesController {
    constructor(private readonly service: AddressesService) { }

    @Get('mine')
    findMine(@CurrentUser() user: { id: number }) {
        return this.service.findMine(user.id);
    }

    @Post()
    create(@CurrentUser() user: { id: number }, @Body() dto: CreateAddressDto) {
        return this.service.create(user.id, dto);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: { id: number },
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.service.update(user.id, id, dto);
    }

    @Delete(':id')
    remove(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
        return this.service.remove(user.id, id);
    }
}