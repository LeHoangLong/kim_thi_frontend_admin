import { ErrorModel } from "../models/ErrorModel";

export interface ErrorState {
    readonly active: ErrorModel[],
    readonly cleared: ErrorModel[],
}