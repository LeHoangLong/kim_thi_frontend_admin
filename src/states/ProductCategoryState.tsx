import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { StatusModel } from "../models/StatusModel";

export interface ProductCategoryState {
    readonly categories: ProductCategoryModel[],
    readonly status: StatusModel,
    readonly numberOfCategories: number,
}