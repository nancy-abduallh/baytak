import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('technicians/:technicianId/reviews')
export class TechnicianReviewsController {
    constructor(private readonly service: ReviewsService) { }

    @Get()
    findAll(@Param('technicianId', ParseIntPipe) technicianId: number) {
        return this.service.findByTechnician(technicianId);
    }
}