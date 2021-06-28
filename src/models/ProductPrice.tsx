export const EPriceUnit : any = {
    KG: "KG"
}

export interface PriceLevel {
    minQuantity: number, 
    price: number
}

export interface ProductPrice {
    unit: string,
    defaultPrice: number,
    priceLevels: PriceLevel[],
}

