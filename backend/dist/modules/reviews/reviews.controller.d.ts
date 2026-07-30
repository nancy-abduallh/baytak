import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly service;
    constructor(service: ReviewsService);
    create(orderId: number, user: {
        id: number;
    }, dto: CreateReviewDto): Promise<import("../../entities/review.entity").Review>;
}
