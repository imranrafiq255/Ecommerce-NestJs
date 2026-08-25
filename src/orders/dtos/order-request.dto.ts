import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateOrderDto{
    @IsString()
    @MinLength(3)
    name: string;
    @IsNumber()
    quantity: number;
    @IsNumber()
    productId: number;
    constructor(name: string, quantity: number, productId: number){
        this.name = name;
        this.quantity = quantity;
        this.productId = productId;
    }
}