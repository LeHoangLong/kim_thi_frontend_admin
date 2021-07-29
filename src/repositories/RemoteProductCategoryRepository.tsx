import axios, { AxiosError } from "axios";
import { HOST_URL } from "../config/Url";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { IProductCategoryRepository } from "./IProductCategoryRepository";

export class RemoteProductCategoryRepository implements IProductCategoryRepository {
    async getNumberOfCategories() : Promise<number> {
        try {
            let response = await axios.get(`${HOST_URL}/categories/count/`)
            return response.data
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async getCategories(limit: number, offset: number) : Promise<ProductCategoryModel[]> {
        try {
            let response = await axios.get(`${HOST_URL}/categories/`, {
                params: {
                    limit: limit, 
                    offset: offset,
                }
            })
            let ret : ProductCategoryModel[] = []
            for (let i = 0 ; i < response.data.length; i++) {
                ret.push(this.jsonToCategory(response.data[i]))
            }
            return ret
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async createCategory(category: ProductCategoryModel) : Promise<ProductCategoryModel> {
        try {
            let response = await axios.post(`${HOST_URL}/categories/`, category)
            return this.jsonToCategory(response.data)
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async deleteCategory(category: ProductCategoryModel) : Promise<boolean> {
        try {
            await axios.delete(`${HOST_URL}/categories/`, {
                data: {
                    category: category,
                }
            })
            return true
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    private jsonToCategory(json: any) : ProductCategoryModel {
        return {
            category: json['category']
        }
    }
}