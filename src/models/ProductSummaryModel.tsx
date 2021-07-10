import { ImageModel } from "./ImageModel";

export interface ProductSummaryModel {
    id: number,
    serialNumber: string,
    name: string,
    avatar: ImageModel,
}