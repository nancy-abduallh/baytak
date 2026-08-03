import { ReviewsService } from './reviews.service';
export declare class TechnicianReviewsController {
    private readonly service;
    constructor(service: ReviewsService);
    findAll(technicianId: number): Promise<{
        id: number;
        rating: number;
        comment: string | null;
        createdAt: Date;
        reviewerName: string;
    }[]>;
}
