import {IsEmail, IsString, Matches} from "class-validator"
export class RegisterRequestDto{
    @IsString()
    name : string;
    @IsEmail()
    email: string;
    @IsString()
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }
  )
    password: string
    constructor(name:string, email:string, password: string){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}