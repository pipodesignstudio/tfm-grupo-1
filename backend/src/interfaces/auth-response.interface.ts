export interface IAuthResponse {
    user:{email:string, created_at?:Date | null};
    token:{expires_in:number, token:string}
}