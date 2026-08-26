import { Expose, Transform, Type } from "class-transformer";
import { IsString } from "class-validator";

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
export class ProductDto {
    @Expose()
    @IsString()
    name: string;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return 0;
        return typeof value.toString === 'function' ? Number(value.toString()) : Number(value);
    })
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
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
    @Expose()
    @Type(() => ProductDto)
    product: ProductDto;
    constructor(id:number, name: string, quantity: number, userId: number, orderBy: OrderUserDto, product: ProductDto){
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.userId = userId;
        this.orderBy = orderBy;
        this.product = product;
    }
}