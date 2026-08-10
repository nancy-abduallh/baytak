import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from './config/configuration';
import databaseConfig from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ServiceCategoriesModule } from './modules/service-categories/service-categories.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AdminModule } from './modules/admin/admin.module';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration, databaseConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<TypeOrmModuleOptions>('database'),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    ServiceCategoriesModule,
    TechniciansModule,
    AddressesModule,
    OrdersModule,
    ReviewsModule,
    FavoritesModule,
    AdminModule,
    SiteSettingsModule,
  ],
})
export class AppModule { }