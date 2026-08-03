import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressesController {
    private readonly service;
    constructor(service: AddressesService);
    findMine(user: {
        id: number;
    }): Promise<import("../../entities/address.entity").Address[]>;
    create(user: {
        id: number;
    }, dto: CreateAddressDto): Promise<import("../../entities/address.entity").Address>;
    update(user: {
        id: number;
    }, id: number, dto: UpdateAddressDto): Promise<import("../../entities/address.entity").Address>;
    remove(user: {
        id: number;
    }, id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
}
