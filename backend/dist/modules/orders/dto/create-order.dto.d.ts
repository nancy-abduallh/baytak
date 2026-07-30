export declare class CreateOrderDto {
    categoryId: number;
    addressId: number;
    technicianId?: number;
    description?: string;
    scheduledDate: string;
    scheduledSlot?: string;
    amount: number;
}
