import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateTechnicianVerifiedDto, UpdateTechnicianActiveDto } from './dto/technician-flags.dto';
import { UpdateUserBlockedDto } from './dto/update-user-blocked.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { OrderStatus } from '../../entities/order.entity';

@UseGuards(JwtAdminGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly admin: AdminService) { }

    @Get('stats')
    getStats() {
        return this.admin.getStats();
    }

    @Get('orders')
    getOrders(@Query('status') status?: OrderStatus) {
        return this.admin.getOrders(status);
    }

    @Patch('orders/:id/status')
    updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
        return this.admin.updateOrderStatus(id, dto);
    }

    @Get('technicians')
    getTechnicians() {
        return this.admin.getTechnicians();
    }

    @Patch('technicians/:id/verified')
    setTechnicianVerified(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianVerifiedDto) {
        return this.admin.setTechnicianVerified(id, dto.isVerified);
    }

    @Patch('technicians/:id/active')
    setTechnicianActive(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianActiveDto) {
        return this.admin.setTechnicianActive(id, dto.isActive);
    }

    @Get('users')
    getUsers() {
        return this.admin.getUsers();
    }

    @Patch('users/:id/blocked')
    setUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserBlockedDto) {
        return this.admin.setUserBlocked(id, dto.isBlocked);
    }

    @Get('categories')
    getCategories() {
        return this.admin.getCategories();
    }

    @Patch('categories/:id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.admin.updateCategory(id, dto);
    }
}