import { FILESERVER_URL } from "../config/Url";
import { NotFound } from "../exceptions/NotFound";
import { ImageModel } from "../models/ImageModel";
import { IImageRepository } from "./IImageRepository";

export class MockImageRepository implements IImageRepository {
    public images: ImageModel[] = []

    constructor(
        numberOfImages: number,
    ) {
        for (let i = 0; i < numberOfImages; i++) {
            this.images.push({
                id: 'image_' + i,
                path: FILESERVER_URL + '/public/products/images/product_images/07633c67-0145-43ee-aa04-f84048f23824',
            })            

            if (i % 5 === 0) {
                this.images[i].path = FILESERVER_URL + '/public/products/images/product_images/4c56fbc6-718e-4cdd-aad0-f762706b7b05'
            }
        }
    }
    
    async fetchImages(offset: number, limit: number): Promise<ImageModel[]> {
        let images: ImageModel[] = []
        for (let i = offset; i < limit + offset && i < this.images.length; i++) {
            images.push(this.images[i])
        }
        return images;
    }

    async fetchImageById(imageId: string): Promise<ImageModel> {
        let image = this.images.find(e => e.id === imageId)
        if (image !== undefined) {
            return image
        } else {
            throw new NotFound('image', 'id', imageId)            
        }
    }

    async createImage(data: FormData): Promise<ImageModel> {
        this.images.push({
            id: 'image_' + this.images.length,
            path: FILESERVER_URL + '/public/products/images/product_images/07633c67-0145-43ee-aa04-f84048f23824',           
        })

        return this.images[this.images.length - 1]
    }

    async fetchNumberOfImages(): Promise<number> {
        return this.images.length
    }

}