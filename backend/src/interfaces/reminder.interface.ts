export interface IReminder {
    id: number;
    activityId: number;
    userId: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    active: boolean;
    lastDate?: Date;
}