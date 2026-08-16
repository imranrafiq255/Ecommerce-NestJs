import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    findAll(){
        return [{name : "Imran", age : 25, email : "imran@example.com"}, {name : "Ali", age : 30, email : "ali@example.com"}];
    }
}
