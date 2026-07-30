import { ServiceCategoriesService } from './service-categories.service';
export declare class ServiceCategoriesController {
    private readonly service;
    constructor(service: ServiceCategoriesService);
    findAll(): Promise<import("../../entities/service-category.entity").ServiceCategory[]>;
}
