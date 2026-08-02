import { Repository } from 'typeorm';
import { Admin } from '../../entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateOwnProfileDto } from './dto/update-own-profile.dto';
export interface RequestingAdmin {
    id: number;
    role: string;
}
export declare class AdminsService {
    private readonly admins;
    constructor(admins: Repository<Admin>);
    getPermissionsCatalogue(): {
        key: "dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage";
        label: string;
    }[];
    list(): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
        isActive: boolean;
        createdAt: string;
    }[]>;
    me(id: number): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    create(dto: CreateAdminDto, actor: RequestingAdmin): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    update(id: number, dto: UpdateAdminDto, actor: RequestingAdmin): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    remove(id: number, actor: RequestingAdmin): Promise<{
        id: number;
        deleted: boolean;
    }>;
    updateOwnProfile(id: number, dto: UpdateOwnProfileDto): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    private assertNotLastSuperAdmin;
    private toRow;
}
