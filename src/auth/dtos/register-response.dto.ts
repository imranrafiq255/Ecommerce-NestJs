import { Exclude, Expose } from "class-transformer";

export class RegisterResponseDto{
    @Expose()
    name: string;
    @Expose()
    email: string
    @Exclude()
    password ?: string
    constructor(name:string, email: string, partial: Partial<RegisterResponseDto>){
        this.name = name;
        this.email = email;
        // Object.assign(this, partial);
    }
}