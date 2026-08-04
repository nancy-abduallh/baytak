import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermission } from './decorators/require-permission.decorator';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { UpdateTechnicianVerifiedDto, UpdateTechnicianActiveDto } from './dto/technician-flags.dto';
import { UpdateUserBlockedDto } from './dto/update-user-blocked.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import type { OrderStatus } from '../../entities/order.entity';
import {
    AVATAR_MAX_SIZE_BYTES,
    avatarImageFileFilter,
    technicianAvatarStorage,
} from '../../common/utils/avatar-upload.util';

@UseGuards(JwtAdminGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly admin: AdminService) { }

    @Get('stats')
    @RequirePermission('dashboard.view')
    getStats() {
        return this.admin.getStats();
    }

    @Get('analytics')
    @RequirePermission('dashboard.view')
    getAnalytics() {
        return this.admin.getAnalytics();
    }

    // ---------- Orders ----------
    @Get('orders')
    @RequirePermission('orders.view')
    getOrders(@Query('status') status?: OrderStatus) {
        return this.admin.getOrders(status);
    }

    @Patch('orders/:id/status')
    @RequirePermission('orders.update_status')
    updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
        return this.admin.updateOrderStatus(id, dto);
    }

    @Delete('orders/:id')
    @RequirePermission('orders.delete')
    deleteOrder(@Param('id', ParseIntPipe) id: number) {
        return this.admin.deleteOrder(id);
    }

    // ---------- Technicians ----------
    @Get('technicians')
    @RequirePermission('technicians.manage')
    getTechnicians() {
        return this.admin.getTechnicians();
    }

    @Post('technicians')
    @RequirePermission('technicians.manage')
    createTechnician(@Body() dto: CreateTechnicianDto) {
        return this.admin.createTechnician(dto);
    }

    @Patch('technicians/:id')
    @RequirePermission('technicians.manage')
    updateTechnician(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianDto) {
        return this.admin.updateTechnician(id, dto);
    }

    @Delete('technicians/:id')
    @RequirePermission('technicians.manage')
    deleteTechnician(@Param('id', ParseIntPipe) id: number) {
        return this.admin.deleteTechnician(id);
    }

    @Post('technicians/:id/avatar')
    @RequirePermission('technicians.manage')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: technicianAvatarStorage,
            fileFilter: avatarImageFileFilter,
            limits: { fileSize: AVATAR_MAX_SIZE_BYTES },
        }),
    )
    uploadTechnicianAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('يرجى اختيار صورة');
        return this.admin.updateTechnicianAvatar(id, file);
    }

    @Delete('technicians/:id/avatar')
    @RequirePermission('technicians.manage')
    removeTechnicianAvatar(@Param('id', ParseIntPipe) id: number) {
        return this.admin.removeTechnicianAvatar(id);
    }

    // kept as dedicated toggle endpoints for the quick-action buttons in the table view
    @Patch('technicians/:id/verify')
    @RequirePermission('technicians.manage')
    setTechnicianVerified(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianVerifiedDto) {
        return this.admin.setTechnicianVerified(id, dto.isVerified);
    }

    @Patch('technicians/:id/active')
    @RequirePermission('technicians.manage')
    setTechnicianActive(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTechnicianActiveDto) {
        return this.admin.setTechnicianActive(id, dto.isActive);
    }

    // ---------- Users ----------
    @Get('users')
    @RequirePermission('users.manage')
    getUsers() {
        return this.admin.getUsers();
    }

    @Patch('users/:id/block')
    @RequirePermission('users.manage')
    setUserBlocked(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserBlockedDto) {
        return this.admin.setUserBlocked(id, dto.isBlocked);
    }

    // ---------- Categories ----------
    @Get('categories')
    @RequirePermission('categories.manage')
    getCategories() {
        return this.admin.getCategories();
    }

    @Post('categories')
    @RequirePermission('categories.manage')
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.admin.createCategory(dto);
    }

    @Patch('categories/:id')
    @RequirePermission('categories.manage')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.admin.updateCategory(id, dto);
    }

    @Delete('categories/:id')
    @RequirePermission('categories.manage')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.admin.deleteCategory(id);
    }
}