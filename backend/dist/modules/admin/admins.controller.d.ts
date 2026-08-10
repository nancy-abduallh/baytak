import { AdminsService } from './admins.service';
import type { RequestingAdmin } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateOwnProfileDto } from './dto/update-own-profile.dto';
export declare class AdminsController {
    private readonly service;
    constructor(service: AdminsService);
    me(user: RequestingAdmin): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    updateMe(user: RequestingAdmin, dto: UpdateOwnProfileDto): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    getPermissionsCatalogue(): {
        key: "dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage";
        label: string;
    }[];
    list(): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
        isActive: boolean;
        createdAt: string;
    }[]>;
    create(dto: CreateAdminDto, user: RequestingAdmin): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    update(id: number, dto: UpdateAdminDto, user: RequestingAdmin): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../../entities/admin.entity").AdminRole;
        permissions: ("dashboard.view" | "orders.view" | "orders.update_status" | "orders.delete" | "technicians.manage" | "users.manage" | "categories.manage" | "admins.manage" | "settings.manage")[];
        isActive: boolean;
        createdAt: string;
    }>;
    remove(id: number, user: RequestingAdmin): Promise<{
        id: number;
        deleted: boolean;
    }>;
}
