import { ProductCategoryModel } from "../models/ProductCategoryModel";
import { IProductCategoryRepository } from "./IProductCategoryRepository";

export class MockProductCategoryRepository implements IProductCategoryRepository {
    public categories: ProductCategoryModel[] = []
    
    constructor(
        numberOfCategories: number
    ) {
        for (let i = 0; i < numberOfCategories; i++) {
            this.categories.push({
                category: `cat-${i}`
            })
        }
    }

    async getNumberOfCategories() : Promise<number> {
        return this.categories.length
    }

    async getCategories(limit: number, offset: number) : Promise<ProductCategoryModel[]> {
        let ret: ProductCategoryModel[] = []
        for (let i = offset; i < offset + limit && i < this.categories.length; i++) {
            ret.push(this.categories[i])
        }
        return ret
    }

    getCategoriesSync(limit: number, offset: number) : ProductCategoryModel[] {
        let ret: ProductCategoryModel[] = []
        for (let i = offset; i < offset + limit && i < this.categories.length; i++) {
            ret.push(this.categories[i])
        }
        return ret
    }

    async createCategory(category: ProductCategoryModel) : Promise<ProductCategoryModel> {
        let newCategory = {
            ...category,
            id: this.categories.length
        }
        this.categories.push(newCategory)
        return newCategory
    }

    async deleteCategory(category: ProductCategoryModel) : Promise<boolean> {
        let index = this.categories.findIndex(e => e.category === category.category)
        if (index !== -1) {
            this.categories.splice(index, 1)
            return true
        } else {
            return false
        }
    }
}