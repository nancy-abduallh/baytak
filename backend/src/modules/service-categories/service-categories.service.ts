import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../../entities/service-category.entity';

@Injectable()
export class ServiceCategoriesService {
    constructor(@InjectRepository(ServiceCategory) private readonly repo: Repository<ServiceCategory>) { }

    findAll() {
        return this.repo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    }
}