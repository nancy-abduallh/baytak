import { Repository } from 'typeorm';
import { ServiceCategory } from '../../entities/service-category.entity';
export declare class ServiceCategoriesService {
    private readonly repo;
    constructor(repo: Repository<ServiceCategory>);
    findAll(): Promise<ServiceCategory[]>;
}
