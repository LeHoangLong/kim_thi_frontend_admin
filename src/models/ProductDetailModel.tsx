import { ImageModel } from "./ImageModel";
import { ProductCategoryModel } from "./ProductCategoryModel";
import { ProductPrice } from "./ProductPrice";

export interface ProductDetailModel {
    id: number | null,
    serialNumber: string,
    defaultPrice: ProductPrice | undefined,
    alternativePrices: ProductPrice[],
    name: string,
    avatar: ImageModel,
    rank: number,
    categories: ProductCategoryModel[],
    wholesalePrices: string[],
    description: string,
}