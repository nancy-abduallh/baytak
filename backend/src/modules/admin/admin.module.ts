import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { PermissionsGuard } from './guards/permissions.guard';
import { Admin } from '../../entities/admin.entity';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { Technician } from '../../entities/technician.entity';
import { ServiceCategory } from '../../entities/service-category.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin, Order, User, Technician, ServiceCategory]),
        PassportModule,
        JwtModule.register({}),
        OrdersModule,
    ],
    controllers: [AdminAuthController, AdminController, AdminsController],
    providers: [AdminAuthService, AdminService, AdminsService, JwtAdminStrategy, PermissionsGuard],
})
export class AdminModule { }
