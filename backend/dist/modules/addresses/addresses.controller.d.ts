import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressesController {
    private readonly service;
    constructor(service: AddressesService);
    findMine(user: {
        id: number;
    }): Promise<import("../../entities/address.entity").Address[]>;
    create(user: {
        id: number;
    }, dto: CreateAddressDto): Promise<import("../../entities/address.entity").Address>;
}
