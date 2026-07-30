export declare class Notification {
    id: number;
    userId: number | null;
    technicianId: number | null;
    title: string;
    body: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
}
