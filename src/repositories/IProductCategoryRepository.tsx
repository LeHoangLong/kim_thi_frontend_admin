import { ProductCategoryModel } from "../models/ProductCategoryModel";

export interface IProductCategoryRepository {
    getNumberOfCategories() : Promise<number>;
    getCategories(limit: number, offset: number) : Promise<ProductCategoryModel[]>
    createCategory(category: ProductCategoryModel) : Promise<ProductCategoryModel>
    deleteCategory(category: ProductCategoryModel) : Promise<boolean>
}