import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Order } from '../../entities/order.entity';
import { Technician } from '../../entities/technician.entity';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly reviews;
    private readonly orders;
    private readonly technicians;
    constructor(reviews: Repository<Review>, orders: Repository<Order>, technicians: Repository<Technician>);
    findByTechnician(technicianId: number): Promise<{
        id: number;
        rating: number;
        comment: string | null;
        createdAt: Date;
        reviewerName: string;
    }[]>;
    create(orderId: number, userId: number, dto: CreateReviewDto): Promise<Review>;
    private recalculateTechnicianRating;
}
