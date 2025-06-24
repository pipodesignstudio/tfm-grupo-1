export interface IAuthResponse {
    res:any;
    data:IAuthData;
    success:boolean;
    message:string;
    statusCode:number;
}


export interface IAuthData {
    user:{email:string, created_at?:Date | null, primera_sesion?:boolean, nombre:string | null, apellido:string | null, img_perfil:Uint8Array | null, nick:string};
    token:{expires_in:number, token:string}
}