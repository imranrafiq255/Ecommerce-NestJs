import { Exclude, Expose } from "class-transformer";

export class LoginResponseDto{
    @Expose()
    email:string;
    @Expose()
    name:string;
    @Exclude()
    password?:string
    constructor(email:string, name:string){
        this.email = email;
        this.name = name;
    }
}