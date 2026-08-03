import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressesService {
    private readonly repo;
    constructor(repo: Repository<Address>);
    findMine(userId: number): Promise<Address[]>;
    create(userId: number, dto: CreateAddressDto): Promise<Address>;
    update(userId: number, addressId: number, dto: UpdateAddressDto): Promise<Address>;
    remove(userId: number, addressId: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    private findOwned;
    private clearDefault;
}
