import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';

@UseGuards(JwtAccessGuard)
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly service: FavoritesService) { }

    @Get('mine')
    findMine(@CurrentUser() user: { id: number }) {
        return this.service.findMine(user.id);
    }

    @Get('mine/ids')
    findMineIds(@CurrentUser() user: { id: number }) {
        return this.service.listFavoriteTechnicianIds(user.id);
    }

    @Post(':technicianId')
    add(@CurrentUser() user: { id: number }, @Param('technicianId', ParseIntPipe) technicianId: number) {
        return this.service.add(user.id, technicianId);
    }

    @Delete(':technicianId')
    remove(@CurrentUser() user: { id: number }, @Param('technicianId', ParseIntPipe) technicianId: number) {
        return this.service.remove(user.id, technicianId);
    }
}