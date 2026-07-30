export declare class UpdateOrderStatusDto {
    status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    note?: string;
}
