import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(@InjectRepository(Address) private readonly repo: Repository<Address>) { }

    findMine(userId: number) {
        return this.repo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
    }

    async create(userId: number, dto: CreateAddressDto) {
        if (dto.isDefault) await this.clearDefault(userId);
        return this.repo.save(this.repo.create({ ...dto, userId }));
    }

    async update(userId: number, addressId: number, dto: UpdateAddressDto) {
        const address = await this.findOwned(userId, addressId);
        if (dto.isDefault) await this.clearDefault(userId);
        Object.assign(address, dto);
        return this.repo.save(address);
    }

    async remove(userId: number, addressId: number) {
        const address = await this.findOwned(userId, addressId);
        await this.repo.remove(address);

        // If the deleted address was the default one, promote the most
        // recently created remaining address so the user always has a
        // default to book against.
        if (address.isDefault) {
            const [next] = await this.repo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 1 });
            if (next) await this.repo.update(next.id, { isDefault: true });
        }

        return { id: addressId, deleted: true };
    }

    private async findOwned(userId: number, addressId: number) {
        const address = await this.repo.findOneBy({ id: addressId });
        if (!address) throw new NotFoundException('العنوان غير موجود');
        if (address.userId !== userId) throw new ForbiddenException('لا تملك صلاحية الوصول لهذا العنوان');
        return address;
    }

    private async clearDefault(userId: number) {
        await this.repo.update({ userId, isDefault: true }, { isDefault: false });
    }
}