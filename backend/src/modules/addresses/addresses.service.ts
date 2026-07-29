import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
    constructor(@InjectRepository(Address) private readonly repo: Repository<Address>) { }

    findMine(userId: number) {
        return this.repo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
    }

    create(userId: number, dto: CreateAddressDto) {
        return this.repo.save(this.repo.create({ ...dto, userId }));
    }
}