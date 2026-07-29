import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(JwtAccessGuard)
@Controller()
export class OrdersController {
    constructor(private readonly service: OrdersService) { }

    @Post('orders')
    create(@CurrentUser() user: { id: number }, @Body() dto: CreateOrderDto) {
        return this.service.create(user.id, dto);
    }

    // Matches frontend/src/lib/api.ts's `getOrders(userId)` exactly.
    @Get('users/:userId/orders')
    findMine(@CurrentUser() user: { id: number }, @Param('userId', ParseIntPipe) userId: number) {
        if (user.id !== userId) throw new ForbiddenException('لا تملك صلاحية الوصول لطلبات هذا المستخدم');
        return this.service.findMine(user.id);
    }

    @Get('orders/:id')
    findOne(@CurrentUser() user: { id: number }, @Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id, user.id);
    }

    // Belongs behind a technician/admin guard in production — left open here
    // since technician-side auth isn't built yet. See BACKEND.md §7.
    @Patch('orders/:id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
        return this.service.updateStatus(id, dto);
    }
}