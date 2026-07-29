import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Technician, ServiceCategory])],
    controllers: [TechniciansController],
    providers: [TechniciansService],
})
export class TechniciansModule { }