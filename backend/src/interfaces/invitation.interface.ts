export interface IInvitation {
    id:number;
    destinationEmail: string;
    familyId: number;
    senderId: number;
    role: 'cuidador' | 'admin' | 'nino';
    attended?: boolean;
    accepted?: boolean;
    sentDate?: Date;
}

export interface IExistingInvitationResponse {
    result: 'OK' | 'KO';
    errors?: string[];
    responseMsg?: string;
}