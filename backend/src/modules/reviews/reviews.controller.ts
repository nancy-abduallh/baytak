import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(JwtAccessGuard)
@Controller('orders/:orderId/reviews')
export class ReviewsController {
    constructor(private readonly service: ReviewsService) { }

    @Post()
    create(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() user: { id: number }, @Body() dto: CreateReviewDto) {
        return this.service.create(orderId, user.id, dto);
    }
}