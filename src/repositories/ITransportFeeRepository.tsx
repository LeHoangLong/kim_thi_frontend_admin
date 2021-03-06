import { AreaTransportFee, AreaTransportSummary, BillBasedTransportFee, DistanceBasedTransportFeeOrigin } from "../models/TransportFee";

export interface CreateAreaTransportFeeArgs {
    name: string,
    city: string,
    basicFee: string,
    originIds: number[],
    billBasedTransportFees: BillBasedTransportFee[],
    distanceFeePerKm: string
}

export interface ITransportFeeRepository {
    fetchNumberOfOrigins() : Promise<number>;
    fetchOrigins(limit: number, offset: number) : Promise<DistanceBasedTransportFeeOrigin[]>
    createOrigin(address: string) : Promise<DistanceBasedTransportFeeOrigin>;
    fetchOriginsById(ids: number[]) : Promise<DistanceBasedTransportFeeOrigin[]>

    fetchNumberOfTransportFees() : Promise<number>;
    fetchTransportFeeSummaries(limit: number, offset: number) : Promise<AreaTransportSummary[]>;
    // throw NotFound if id not found
    fetchTransportFee(id: number) : Promise<AreaTransportFee>;
    createTransportFee(args: CreateAreaTransportFeeArgs) : Promise<AreaTransportFee>;
    deleteTransportFee(id: number) : Promise<void>;
    updateTransportFee(id: number, args: CreateAreaTransportFeeArgs) : Promise<AreaTransportFee>
}