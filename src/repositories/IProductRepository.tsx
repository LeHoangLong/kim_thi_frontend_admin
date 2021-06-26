import { ProductSummaryModel } from "../models/ProductSummaryModel";

export interface IProductRepository {
    fetchProductSummaries(offset: number, limit: number) : Promise<ProductSummaryModel[]>;
    fetchNumberOfProducts() : Promise<number>;
}