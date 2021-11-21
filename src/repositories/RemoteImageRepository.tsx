import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { HOST_URL } from "../config/Url";
import { NotFound } from "../exceptions/NotFound";
import { ImageModel } from "../models/ImageModel";
import { IImageRepository } from "./IImageRepository";

@injectable()
export class RemoteImageRepository implements IImageRepository {
    async fetchImages(offset: number, limit: number) : Promise<ImageModel[]> {
        try {
            let response = await axios.get(`${HOST_URL}/images/`)
            let ret : ImageModel[] = []
            for (let i  = 0; i < response.data.length; i++) {
                let imageJson = response.data[i]
                ret.push({
                    id: imageJson['id'],
                    path: HOST_URL + "/" + imageJson['path'],
                })
            }
            return ret
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async fetchNumberOfImages() : Promise<number> {
        try {
            let response = await axios.get(`${HOST_URL}/images/count/`)
            return response.data
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async createImage(data: FormData) : Promise<ImageModel> {
        try {
            let response = await axios.post(`${HOST_URL}/images/`, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            let imageJson = response.data
            return {
                id: imageJson['id'],
                path: HOST_URL + "/" + imageJson['path'],
            }
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async fetchImageById(imageId: string) : Promise<ImageModel> {
        try {
            let response = await axios.get(`${HOST_URL}/images/${imageId}`)
            let imageJson = response.data
            return {
                id: imageJson['id'],
                path: HOST_URL + "/" + imageJson['path'],
            }
        } catch (exception) {
            let axioException = exception as AxiosError
            if (axioException.response?.status === 404) {
                throw new NotFound("ImageModel", "id", imageId)
            }
            throw axioException.response?.statusText;
        }
    }
}