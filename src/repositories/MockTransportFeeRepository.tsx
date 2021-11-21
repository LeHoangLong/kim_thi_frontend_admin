import { injectable } from "inversify";
import { NotFound } from "../exceptions/NotFound";
import { delay } from "../helpers/delay";
import { DistanceBasedTransportFeeOrigin, AreaTransportSummary, AreaTransportFee } from "../models/TransportFee";
import { CreateAreaTransportFeeArgs, ITransportFeeRepository } from "./ITransportFeeRepository";

@injectable()
export class MockTransportFeeRepository implements ITransportFeeRepository {
    public origins: DistanceBasedTransportFeeOrigin[] = []
    public fees: AreaTransportFee[] = []
    constructor(
        numberOfOrigins: number = 100,
        numberOfFees: number = 100,
        public delayMs: number = 0,
    ) {
        for (let i = 0; i < numberOfOrigins; i++) {
            this.origins.push({
                id: i,
                address: `address-${i}`,
                latitude: `${i}.000001`,
                longitude: `${i}.000002`,
            })
        }

        for (let i = 0; i < numberOfFees; i++) {
            this.fees.push({
                id: i,
                name: `fee-${i}`,
                city: `city-${i}`,
                basicFee: `${i}.01`,
                billBasedTransportFee: [{
                    minBillValue: `${i}.01`,
                    basicFee: `${i}.01`,
                    fractionOfBill: `0.0${i}`,
                    fractionOfTotalTransportFee: `0.0${i}`,
                }],
                distanceFeePerKm: `${i}.02`,
                originIds: [],
            })
            this.fees[i].originIds.push(i)
        }
    }

    async fetchNumberOfOrigins(): Promise<number> {
        await delay(this.delayMs)
        return this.origins.length
    }

    async fetchOrigins(limit: number, offset: number): Promise<DistanceBasedTransportFeeOrigin[]> {
        await delay(this.delayMs)
        return this.origins.slice(offset, offset + limit);
    }

    async createOrigin(address: string): Promise<DistanceBasedTransportFeeOrigin> {
        await delay(this.delayMs)
        this.origins.push({
            id: this.origins.length,
            address: address,
            latitude: `${this.origins.length % 359}.000001`,
            longitude: `${this.origins.length % 359}.000002`,
        })
        return this.origins[this.origins.length - 1]
    }

    async deleteOrigin(id: number): Promise<void> {
        await delay(this.delayMs)
        let index = this.origins.findIndex(e => e.id === id)
        if (index !== -1) {
            this.origins.splice(index, 1)
        } else {
            throw new NotFound('origin', 'id', id.toString())
        }
    }

    async fetchNumberOfTransportFees(): Promise<number> {
        await delay(this.delayMs)
        return this.fees.length
    }

    async fetchTransportFeeSummaries(limit: number, offset: number): Promise<AreaTransportSummary[]> {
        await delay(this.delayMs)
        return this.fees.slice(offset, offset + limit)
    }

    async fetchTransportFee(id: number): Promise<AreaTransportFee> {
        await delay(this.delayMs)
        let index = this.fees.findIndex(e => e.id === id)
        if (index === -1) {
            throw new NotFound('transport_fee', 'id', id.toString())
        } else {
            return this.fees[id]
        }
    }

    async createTransportFee(args: CreateAreaTransportFeeArgs): Promise<AreaTransportFee> {
        await delay(this.delayMs)
        let newFee: AreaTransportFee = {
            id: this.fees.length,
            name: args.name,
            city: args.city,
            basicFee: args.basicFee,
            billBasedTransportFee: args.billBasedTransportFees,
            distanceFeePerKm: args.distanceFeePerKm,
            originIds: args.originIds,
        }
        this.fees.push(newFee)
        return newFee
    }

    async deleteTransportFee(id: number): Promise<void> {
        await delay(this.delayMs)
        let index = this.fees.findIndex(e => e.id === id)
        if (index === -1) {
            throw new NotFound('transport_fee', 'id', id.toString())
        }
        this.fees.splice(index, 1)
    }

    async updateTransportFee(id: number, args: CreateAreaTransportFeeArgs): Promise<AreaTransportFee> {
        await delay(this.delayMs)
        let index = this.fees.findIndex(e => e.id === id)
        if (index === -1) {
            throw new NotFound('transport_fee', 'id', id.toString())
        }
        let newFee: AreaTransportFee = {
            id: this.fees.length,
            name: args.name,
            city: args.city,
            basicFee: args.basicFee,
            billBasedTransportFee: args.billBasedTransportFees,
            distanceFeePerKm: args.distanceFeePerKm,
            originIds: args.originIds,
        }
        this.fees[index] = newFee
        return newFee
    }

    async fetchOriginsById(ids: number[]) : Promise<DistanceBasedTransportFeeOrigin[]> {
        await delay(this.delayMs)
        let ret: DistanceBasedTransportFeeOrigin[] = []
        for (let i = 0; i < ids.length; i++) {
            let origin = this.origins.find(e => e.id === ids[i])
            if (origin) {
                ret.push(origin)
            }
        }
        return ret
    }

}