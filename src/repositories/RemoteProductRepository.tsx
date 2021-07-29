import axios, { AxiosError } from "axios";
import { HOST_URL } from "../config/Url";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { ProductDetailModel } from "../models/ProductDetailModel";
import { EPriceUnit, ProductPrice } from "../models/ProductPrice";
import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { IProductRepository } from "./IProductRepository";

export class RemoteProductRepository implements IProductRepository {
    async fetchProductSummaries(offset: number, limit: number) : Promise<ProductSummaryModel[]> {
        try {
            let ret : ProductSummaryModel[] = [];
            let response = await axios.get(`${HOST_URL}/products/summaries`, {
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
                    serialNumber: result.product.serialNumber,
                    name: result.product.name,
                    avatar: {
                        ...result.avatar,
                        path: HOST_URL + "/" + result.avatar.path,
                    },
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

    async createProduct(productDetail: ProductDetailModel) : Promise<ProductDetailModel> {
        try {
            let response = await axios.post(`${HOST_URL}/products/`, productDetail);
            return this.jsonToProductDetail(response.data)
        } catch ( exception ) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    private jsonToCategory(json: any) : ProductCategoryModel {
        return {
            category: json['category']
        }
    }

    jsonToProductDetail(json: any) : ProductDetailModel {
        let defaultPrice = json.prices.find((e: any) => e.isDefault)
        let alternativePrices = json.prices.filter((e: any) => !e.isDefault)
        let categories : ProductCategoryModel[] = []
        for (let i = 0; i < json.categories.length; i++) {
            categories.push(this.jsonToCategory(json.categories[i]))
        }

        let productDetail = {
            id: json.product.id,
            serialNumber: json.product.serialNumber,
            defaultPrice: defaultPrice,
            alternativePrices: alternativePrices,
            name: json.product.name,
            avatar: {
                ...json.avatar,
                path: HOST_URL + "/" + json.avatar.path,
            },
            rank: json.product.rank,
            categories: categories,
        }

        return productDetail
    }

    async fetchProductDetailById(productId: number) : Promise<ProductDetailModel> {
        try {
            let response = await axios.get(`${HOST_URL}/products/${productId}/`);
            return this.jsonToProductDetail(response.data)
        } catch (exception) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }

    async updateProduct(productId: number, productDetail: ProductDetailModel) : Promise<ProductDetailModel> {
        try {
            let response = await axios.put(`${HOST_URL}/products/${productId}`, productDetail);
            let ret = this.jsonToProductDetail(response.data)
            return ret
        } catch ( exception ) {
            let axioException = exception as AxiosError
            throw axioException.response?.statusText;
        }
    }
}