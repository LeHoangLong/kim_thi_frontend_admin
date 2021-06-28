import { ProductPrice } from "./ProductPrice";

export interface ProductDetail {
    id: string | null,
    defaultPrice: ProductPrice,
    alternativePrices: ProductPrice[],
    name: string,
    avatarId: string,
    rank: number
}