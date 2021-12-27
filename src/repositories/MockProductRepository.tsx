import { FILESERVER_URL, HOST_URL } from '../config/Url';
import { NotFound } from '../exceptions/NotFound';
import { ProductCategoryModel } from '../models/ProductCategoryModel';
import { ProductDetailModel } from '../models/ProductDetailModel';
import { ProductSummaryModel } from '../models/ProductSummaryModel';
import { IProductRepository } from './IProductRepository'
import { MockProductCategoryRepository } from './MockProductCategoryRepository';

export class MockProductRepository implements IProductRepository {
    public products: ProductDetailModel[] = []

    constructor(
        productCategoryRepository: MockProductCategoryRepository,
        numberOfProducts: number,
    ) {
        let categories = productCategoryRepository.getCategoriesSync(0, 2)
        for (let i = 0; i < numberOfProducts; i++) {
            let productCategories: ProductCategoryModel[] = []
            if (i % 3 === 1 && categories.length > 0) {
                productCategories.push(categories[0])
            } 
            
            if (i % 2 === 0 && categories.length > 1) {
                productCategories.push(categories[1])
            }
            this.products.push({
                id: i,
                serialNumber: `product-${i}`,
                defaultPrice: {
                    unit: 'kg',
                    isDefault: true,
                    defaultPrice: i * 1000,
                    priceLevels: [],
                },
                alternativePrices: [],
                name: `product-${i}`,
                avatar: {
                    id: 'image',
                    path: FILESERVER_URL + '/public/products/images/product_images/07633c67-0145-43ee-aa04-f84048f23824',
                },
                images: [
                    {
                        id: 'image-1',
                        path: FILESERVER_URL + '/public/products/images/product_images/1c983f9a-35ad-4eb8-9ad8-b3b20dc98400',
                    },
                    {
                        id: 'image-2',
                        path: FILESERVER_URL + '/public/products/images/product_images/eda36712-d31f-497a-a67d-3d7609304024',
                    }
                ],
                rank: 0,
                categories: productCategories,
                wholesalePrices: [],
                description: `description-${i}`,
            })
        }
    }

    async fetchProductSummaries(offset: number, limit: number): Promise<ProductSummaryModel[]> {
        let ret: ProductSummaryModel[] = []
        for (let i = offset; i < offset + limit && i < this.products.length; i++) {
            ret.push({
                ...this.products[i],
                id: this.products[i].id as number,
            })
        }
        return ret
    }

    async fetchNumberOfProducts(): Promise<number> {
        return this.products.length
    }
    
    async createProduct(productDetail: ProductDetailModel): Promise<ProductDetailModel> {
        let newProductDetail = {
            ...productDetail,
            id: this.products.length
        }
        this.products.push(newProductDetail)
        return newProductDetail
    }
    
    async fetchProductDetailById(productId: number): Promise<ProductDetailModel> {
        let ret = this.products.find(e => e.id === productId)
        if (ret) {
            return ret
        } else {
            throw new NotFound("Product", "id", productId.toString())
        }
    }
    
    async updateProduct(productId: number, productDetail: ProductDetailModel): Promise<ProductDetailModel> {
        let index = this.products.findIndex(e => e.id === productId)
        if (index === -1) {
            throw new NotFound("Product", "id", productId.toString())
        } else {
            this.products[index] = {
                ...productDetail,
                id: productId,
            }
        }
        return this.products[index]
    }

}