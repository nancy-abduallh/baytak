import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '../../entities/favorite.entity';
import { Technician } from '../../entities/technician.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Favorite, Technician])],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule { }