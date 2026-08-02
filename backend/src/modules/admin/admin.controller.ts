import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateTechnicianVerifiedDto, UpdateTechnicianActiveDto } from './dto/technician-flags.dto';
import { UpdateUserBlockedDto } from './dto/update-user-blocked.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import type { OrderStatus } from '../../entities/order.entity';

@UseGuards(JwtAdminGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly admin: AdminService) { }

    @Get('stats')
    getStats() {
        return this.admin.getStats();
    }

    @Get('analytics')
    getAnalytics() {
        return this.admin.getAnalytics();
    }

    @Get('orders')
    getOrders(@Query('status') status?: OrderStatus) {
        return this.admin.getOrders(status);
    }

    @Patch('orders/:id/status')
    updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
        return this.admin.updateOrderStatus(id, dto);
    }

    // ---------- Technicians ----------
    @Get('technicians')
    getTechnicians() {
        return this.admin.getTechnicians();
    }

    @Post('technicians')
    createTechnician(@Body() dto: CreateTechnicianDto) {
        return this.admin.createTechnician(dto);
    }

    @Patch('technicians/:id')
    updateTechnician(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianDto) {
        return this.admin.updateTechnician(id, dto);
    }

    @Delete('technicians/:id')
    deleteTechnician(@Param('id', ParseIntPipe) id: number) {
        return this.admin.deleteTechnician(id);
    }

    // kept as dedicated toggle endpoints for the quick-action buttons in the table view
    @Patch('technicians/:id/verify')
    setTechnicianVerified(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianVerifiedDto) {
        return this.admin.setTechnicianVerified(id, dto.isVerified);
    }

    @Patch('technicians/:id/active')
    setTechnicianActive(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianActiveDto) {
        return this.admin.setTechnicianActive(id, dto.isActive);
    }

    // ---------- Users ----------
    @Get('users')
    getUsers() {
        return this.admin.getUsers();
    }

    @Patch('users/:id/block')
    setUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserBlockedDto) {
        return this.admin.setUserBlocked(id, dto.isBlocked);
    }

    // ---------- Categories ----------
    @Get('categories')
    getCategories() {
        return this.admin.getCategories();
    }

    @Post('categories')
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.admin.createCategory(dto);
    }

    @Patch('categories/:id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.admin.updateCategory(id, dto);
    }

    @Delete('categories/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.admin.deleteCategory(id);
    }
}