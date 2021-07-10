import { ProductSummaryModel } from "../models/ProductSummaryModel";
import { StatusModel } from "../models/StatusModel";

export interface ProductSummaryState {
    readonly summaries: (ProductSummaryModel | undefined)[],
    readonly status: StatusModel,
    readonly numberOfProducts: number,
}