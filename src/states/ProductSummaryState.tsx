import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { StatusModel } from "../models/StatusModel";

export interface ProductSummaryState {
    readonly summaries: ProductSummaryModel[],
    readonly status: StatusModel,
    readonly numberOfProducts: number,
}