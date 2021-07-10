import { ImageModel } from "../models/ImageModel";

export interface IImageRepository {
    fetchImages(offset: number, limit: number) : Promise<ImageModel[]>;
    fetchImageById(imageId: string) : Promise<ImageModel>;
    createImage(data: FormData) : Promise<ImageModel>
    fetchNumberOfImages() : Promise<number>;
}