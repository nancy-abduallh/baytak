import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderStatusHistory])],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway],
    exports: [OrdersService],
})
export class OrdersModule { }