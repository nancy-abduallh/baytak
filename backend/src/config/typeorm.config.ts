import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { Technician } from '../entities/technician.entity';
import { TechnicianAvailability } from '../entities/technician-availability.entity';
import { Order } from '../entities/order.entity';
import { OrderImage } from '../entities/order-image.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { Review } from '../entities/review.entity';
import { Favorite } from '../entities/favorite.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { Notification } from '../entities/notification.entity';
import { Admin } from '../entities/admin.entity';
import { AuthToken } from '../entities/auth-token.entity';

export default registerAs('database', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'baytak_db',
    entities: [
        User, Address, ServiceCategory, Technician, TechnicianAvailability,
        Order, OrderImage, OrderStatusHistory, Review, Favorite,
        PaymentMethod, Notification, Admin, AuthToken,
    ],
    synchronize: false,
    charset: 'utf8mb4_unicode_ci',
    timezone: 'Z',
}));