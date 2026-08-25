import { IsOptional } from "class-validator";

export class UpdateProductRequestDto{
    @IsOptional()
    name?: string;
    @IsOptional()
    price?: number;
}