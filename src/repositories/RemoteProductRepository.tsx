import axios, { AxiosError } from "axios";
import { HOST_URL } from "../config/Url";
import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { IProductRepository } from "./IProductRepository";

export class RemoteProductRepository implements IProductRepository {
    async fetchProductSummaries(offset: number, limit: number) : Promise<ProductSummaryModel[]> {
        try {
            let ret : ProductSummaryModel[] = [];
            let response = await axios.get(`${HOST_URL}/products/summaries/`, {
                params: {
                    offset: offset,
                    limit: limit,
                }
            })
            let results = response.data
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
                ret.push({
                    id: result.product.id,
                    name: result.product.name,
                    avatarId: result.image.path,
                });
            }
            return ret;
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async fetchNumberOfProducts() : Promise<number> {
        try {
            let response = await axios.get(`${HOST_URL}/products/summaries/count/`)
            return response.data
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }
}