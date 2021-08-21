import axios, { AxiosError } from "axios";
import { jsonSchema } from "uuidv4";
import { HOST_URL } from "../config/Url";
import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../helpers/axios";
import { DistanceBasedTransportFeeOrigin, AreaTransportSummary, AreaTransportFee } from "../models/TransportFee";
import { CreateAreaTransportFeeArgs, ITransportFeeRepository } from "./ITransportFeeRepository";

export class RemoteTransportFeeRepository implements ITransportFeeRepository {
    async fetchOriginsById(ids: number[]) : Promise<DistanceBasedTransportFeeOrigin[]> {
        let response = await axiosGet(`${HOST_URL}/transport_fees/origins`, {
            params: {
                ids: ids
            }
        })
        return response.data
    }

    async fetchNumberOfOrigins(): Promise<number> {
        let response = await axiosGet(`${HOST_URL}/transport_fees/origins/count`)
        return response.data
    }

    async fetchOrigins(limit: number, offset: number): Promise<DistanceBasedTransportFeeOrigin[]> {
        let response = await axiosGet(`${HOST_URL}/transport_fees/origins`, {
            params: {
                limit: limit,
                offset: offset,
            }
        })
        return response.data
    }


    async createOrigin(address: string): Promise<DistanceBasedTransportFeeOrigin> {
        let response = await axiosPost(`${HOST_URL}/transport_fees/origins`, {
            address: address,
        })
        return response.data
    }

    async fetchNumberOfTransportFees(): Promise<number> {
        let response = await axiosGet(`${HOST_URL}/transport_fees/count`)
        return response.data
    }

    async fetchTransportFeeSummaries(limit: number, offset: number): Promise<AreaTransportSummary[]> {
        let response = await axiosGet(`${HOST_URL}/transport_fees`, {
            params: {
                limit: limit,
                offset: offset
            }
        })
        let ret: AreaTransportSummary[] = []
        for (let i = 0; i < response.data.length; i++) {
            ret.push(this.jsonToTransportFeeSummary(response.data[i]))
        }
        return ret
    }

    jsonToTransportFeeSummary(json: any): AreaTransportSummary {
        return {
            id: json.id,
            name: json.name,
            city: json.areaCity,
        }
    }
    
    jsonToTransportFeeDetail(json: any): AreaTransportFee {
        return {
            id: json.id,
            name: json.name,
            city: json.areaCity,
            basicFee: json.basicFee,
            billBasedTransportFee: json.billBasedTransportFee,
            distanceFeePerKm: json.distanceFeePerKm,
            originIds: json.transportOriginIds,
        }
    }

    async fetchTransportFee(id: number): Promise<AreaTransportFee> {
        let response = await axiosGet(`${HOST_URL}/transport_fees/${id}`)
        return this.jsonToTransportFeeDetail(response.data)
    }

    async createTransportFee(args: CreateAreaTransportFeeArgs): Promise<AreaTransportFee> {
        let response = await axiosPost(`${HOST_URL}/transport_fees`, this.convertToBackendCompatible(args))
        return this.jsonToTransportFeeDetail(response.data)
    }

    async deleteTransportFee(id: number): Promise<void> {
        await axiosDelete(`${HOST_URL}/transport_fees/${id}`)
    }

    async updateTransportFee(id: number, args: CreateAreaTransportFeeArgs): Promise<AreaTransportFee> {
        let response = await axiosPut(`${HOST_URL}/transport_fees/${id}`, this.convertToBackendCompatible(args))
        return this.jsonToTransportFeeDetail(response.data)
    }

    private convertToBackendCompatible(args: CreateAreaTransportFeeArgs) : any {
        let ret : any = {
            ...args,
            transportOriginIds: [],
        }
        for (let i = 0; i < args.originIds.length; i++) {
            ret.transportOriginIds.push(args.originIds[i])
        }
        delete ret.originIds
        return ret
    }
}