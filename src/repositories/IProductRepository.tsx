import { ProductDetailModel } from "../models/ProductDetailModel";
import { ProductSummaryModel } from "../models/ProductSummaryModel";

export interface IProductRepository {
    fetchProductSummaries(offset: number, limit: number) : Promise<ProductSummaryModel[]>;
    fetchNumberOfProducts() : Promise<number>;
    createProduct(productDetail: ProductDetailModel) : Promise<ProductDetailModel>;
    fetchProductDetailById(productId: number) : Promise<ProductDetailModel>;
    updateProduct(productId: number, productDetail: ProductDetailModel) : Promise<ProductDetailModel>
}