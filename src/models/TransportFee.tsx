export interface BillBasedTransportFee {
    minBillValue?: string,
    basicFee?: string,
    fractionOfBill?: string,
    fractionOfTotalTransportFee?: string,
}

export interface DistanceBasedTransportFeeOrigin {
    id: number,
    address: string,
    latitude: string,
    longitude: string,
}

export interface AreaTransportSummary {
    id: number,
    name: string,
    city: string,
}

export interface AreaTransportFee {
    id: number,
    name: string,
    city: string,
    basicFee: string,
    billBasedTransportFee: BillBasedTransportFee[],
    distanceFeePerKm: string,
    originIds: number[],
}