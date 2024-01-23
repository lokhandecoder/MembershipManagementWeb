export interface Plan{
    planName: string;
    planDuration: number;
    durationTypeId: number;
    durationType: string;
    planCost: number;
    isActive: boolean;
    id: string; // Assuming id is a GUID
}