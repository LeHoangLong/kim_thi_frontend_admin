import 'reflect-metadata';
import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { FILESERVER_URL, HOST_URL } from "../config/Url";
import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { ProductDetailModel } from "../models/ProductDetailModel";
import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { IProductRepository } from "./IProductRepository";
import { ImageModel } from '../models/ImageModel';
import { PriceLevel, ProductPrice } from '../models/ProductPrice';
import Decimal from 'decimal.js';

export function jsonToImageModel(json: any) : ImageModel {
    let path = json['path']
    if (!path.includes('http')) {
        path = FILESERVER_URL + '/' + path 
    }
    return {
        id: json['id'],
        path: path,
    }
}


export function jsonToPriceLevel(json: any) : PriceLevel {
    return {
        minQuantity: parseInt(json['minQuantity']), 
        price: parseInt(json['price'])
    }
}

export function jsonToProductPrice(json: any) : ProductPrice {
    let ret: ProductPrice =   {
        unit: (json['unit'] as string).toLowerCase(),
        isDefault: json['isDefault'],
        defaultPrice: parseInt(json['defaultPrice']),
        priceLevels: [],
    }

    for (let i = 0; i < json['priceLevels'].length; i++) {
        ret.priceLevels.push(jsonToPriceLevel(json['priceLevels'][i]))
    }

    return ret
}

@injectable()
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
                    avatar: jsonToImageModel(result.avatar),
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
        let defaultPrice : ProductPrice = json.prices.find((e: any) => e.isDefault)
        let alternativePrices : ProductPrice[] = json.prices.filter((e: any) => !e.isDefault)
        let categories : ProductCategoryModel[] = []
        for (let i = 0; i < json.categories.length; i++) {
            categories.push(this.jsonToCategory(json.categories[i]))
        }

        for (let i = 0; i < alternativePrices.length; i++) {
            alternativePrices[i] = jsonToProductPrice(alternativePrices[i])
        }

        if (defaultPrice) {
            defaultPrice = jsonToProductPrice(defaultPrice)
        }

        let productDetail = {
            id: json.product.id,
            serialNumber: json.product.serialNumber,
            defaultPrice: defaultPrice,
            alternativePrices: alternativePrices,
            name: json.product.name,
            avatar: jsonToImageModel(json.avatar),
            rank: json.product.rank,
            categories: categories,
            wholesalePrices: json.product.wholesalePrices,
            description: json.product.description,
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