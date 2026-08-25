import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProductsRequestDto } from '../dtos/create-product-request.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/enum.role';
import { UpdateProductRequestDto } from '../dtos/update-product-request.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}
    @UseGuards(JwtAuthGuard)
    @Get()
    async getProducts(){
        return await this.productsService.getProducts();
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async createProduct(@Body() data: CreateProductsRequestDto){
        return await this.productsService.createProduct(data);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete(":id")
    async deleteProduct(@Param("id") id: number){
        return await this.productsService.deleteProduct(id);
    }
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.User)
    @Put(":id")
    async updateProduct(@Param("id") id:number, @Body() data:UpdateProductRequestDto){
        return await this.productsService.updateProduct(id, data);
    }
}
