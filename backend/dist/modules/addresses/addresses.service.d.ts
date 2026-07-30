import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressesService {
    private readonly repo;
    constructor(repo: Repository<Address>);
    findMine(userId: number): Promise<Address[]>;
    create(userId: number, dto: CreateAddressDto): Promise<Address>;
}
