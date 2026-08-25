import { IsInt, IsString } from "class-validator";

export class CreateProductsRequestDto{
    @IsString()
    name: string;
    @IsInt({message: "Price must be a number"})
    price: number;
    constructor(name:string, price:number){
        this.name = name;
        this.price = price;
    }
}