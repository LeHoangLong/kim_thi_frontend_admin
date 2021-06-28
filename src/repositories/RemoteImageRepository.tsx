import axios, { AxiosError } from "axios";
import { HOST_URL } from "../config/Url";
import { ImageModel } from "../models/ImageModel";
import { IImageRepository } from "./IImageRepository";

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

}