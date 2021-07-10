import { ProductDetailModel } from "../models/ProductDetailModel"
import { StatusModel } from "../models/StatusModel";

export interface ProductDetailState {
    readonly products: ProductDetailModel[],
    readonly status: any, // 1 status per product
}