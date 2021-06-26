import { ImageModel } from "../models/ImageModel";
import { StatusModel } from "../models/StatusModel";

export interface ImageState {
    readonly images: ImageModel[],
    readonly status: StatusModel,
    readonly numberOfImages: number,
}