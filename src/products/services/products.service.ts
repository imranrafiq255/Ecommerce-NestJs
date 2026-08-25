import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products.repository";

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
    ) {}

    async getProducts() {
        return this.productsRepository.getProducts();
    }

    async createProduct(data: { name: string; price: number }) {
        return this.productsRepository.createProducts(data);
    }

    async deleteProduct(id: number) {
        const product = await this.productsRepository.deleteProduct(id);

        if (!product) {
            throw new NotFoundException("Product not found");
        }

        return {
            message: "Product deleted successfully",
        };
    }
    async updateProduct(id:number, data : {name?:string, price?:number}){
        const product = await this.productsRepository.updateProduct(id, data);
        if (!product){
            throw new NotFoundException("Product not found with given id");
        }
        return {
            message : `${product.name} is updated successfully`
        }
    }
}