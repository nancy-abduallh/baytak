import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../../entities/review.entity';
import { Order } from '../../entities/order.entity';
import { Technician } from '../../entities/technician.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TechnicianReviewsController } from './technician-reviews.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Review, Order, Technician])],
    controllers: [ReviewsController, TechnicianReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule { }