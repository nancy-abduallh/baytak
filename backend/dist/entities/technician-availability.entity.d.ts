import { Technician } from './technician.entity';
export declare class TechnicianAvailability {
    id: number;
    technicianId: number;
    technician: Technician;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
