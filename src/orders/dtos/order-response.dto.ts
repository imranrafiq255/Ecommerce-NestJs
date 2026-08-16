import { Expose, Type } from "class-transformer";

export class OrderUserDto{
    @Expose()
    name: string;
    @Expose()
    email: string;
    constructor(name:string, email: string){
        this.name = name;
        this.email = email;
    }
}
export class OrdersResponseDto{
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    quantity: number;
    @Expose()
    userId: number;
    @Expose()
    @Type(() => OrderUserDto)
    orderBy: OrderUserDto;
    constructor(id:number, name: string, quantity: number, userId: number, orderBy: OrderUserDto){
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.userId = userId;
        this.orderBy = orderBy;
    }
}