import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @IsEmail()
    @IsString()
    email: string;
    @IsString()
    @MinLength(3)
    name: string;
    constructor(email:string, name:string){
        this.email = email;
        this.name = name;
    }
}