export const EPriceUnit : any = {
    KG: "KG"
}

export interface PriceLevel {
    minQuantity: number, 
    price: number
}

export interface ProductPrice {
    unit: string,
    isDefault: boolean,
    defaultPrice: number,
    priceLevels: PriceLevel[],
}

