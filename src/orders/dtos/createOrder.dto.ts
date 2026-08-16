import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateOrderDto{
    @IsNumber()
    id: number;
    @IsString()
    @MinLength(3)
    product: string;
    @IsNumber()
    quantity: number;
    constructor(id: number, product: string, quantity: number){
        this.id = id;
        this.product = product;
        this.quantity = quantity;
    }
}