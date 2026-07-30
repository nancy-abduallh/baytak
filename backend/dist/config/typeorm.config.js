"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
const address_entity_1 = require("../entities/address.entity");
const service_category_entity_1 = require("../entities/service-category.entity");
const technician_entity_1 = require("../entities/technician.entity");
const technician_availability_entity_1 = require("../entities/technician-availability.entity");
const order_entity_1 = require("../entities/order.entity");
const order_image_entity_1 = require("../entities/order-image.entity");
const order_status_history_entity_1 = require("../entities/order-status-history.entity");
const review_entity_1 = require("../entities/review.entity");
const favorite_entity_1 = require("../entities/favorite.entity");
const payment_method_entity_1 = require("../entities/payment-method.entity");
const notification_entity_1 = require("../entities/notification.entity");
const admin_entity_1 = require("../entities/admin.entity");
const auth_token_entity_1 = require("../entities/auth-token.entity");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'mysql',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'baytak_db',
    entities: [
        user_entity_1.User, address_entity_1.Address, service_category_entity_1.ServiceCategory, technician_entity_1.Technician, technician_availability_entity_1.TechnicianAvailability,
        order_entity_1.Order, order_image_entity_1.OrderImage, order_status_history_entity_1.OrderStatusHistory, review_entity_1.Review, favorite_entity_1.Favorite,
        payment_method_entity_1.PaymentMethod, notification_entity_1.Notification, admin_entity_1.Admin, auth_token_entity_1.AuthToken,
    ],
    synchronize: false,
    charset: 'utf8mb4_unicode_ci',
    timezone: 'Z',
}));
//# sourceMappingURL=typeorm.config.js.map