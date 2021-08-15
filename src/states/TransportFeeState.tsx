import { NumberIndexMapInterface } from "../helpers/MapInterface";
import { StatusModel } from "../models/StatusModel";
import { AreaTransportFee, AreaTransportSummary, DistanceBasedTransportFeeOrigin } from "../models/TransportFee";

export interface TransportFeeState {
    readonly origins: (DistanceBasedTransportFeeOrigin | null)[],
    readonly numberOfOrigins: number, 
    readonly originsOperationStatus: StatusModel,
    readonly originsMapOperationStatus: StatusModel,
    readonly originsMap: NumberIndexMapInterface<DistanceBasedTransportFeeOrigin>,
    readonly feeSummaries: (AreaTransportSummary | null)[],
    readonly feeDetails: NumberIndexMapInterface<AreaTransportFee>,  
    readonly numberOfTransportFees: number,
    readonly feeSummariesOperationStatus: StatusModel,
    readonly feeDetailOperationStatus: StatusModel,
}