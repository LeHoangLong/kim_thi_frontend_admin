import { ImageModel } from "../models/ImageModel";
import { StatusModel } from "../models/StatusModel";

export interface ImageState {
    readonly images: (ImageModel | undefined)[],
    readonly status: StatusModel,
    readonly numberOfImages: number,
}