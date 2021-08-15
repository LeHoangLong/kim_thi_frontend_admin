import { useEffect } from "react"
import { useState } from "react"
import { BillBasedTransportFee } from "../../models/TransportFee"
import { DecimalInput } from "../components/DecimalInput"
import './NewBillBasedTransportFee.scss'

export interface NewBillBasedTransportFeeProps {
    onChange(fee:  BillBasedTransportFee) : void,
    fee: BillBasedTransportFee | null,
}

export const NewBillBasedTransportFee = (props: NewBillBasedTransportFeeProps) => {
    let [fee, setFee] = useState<BillBasedTransportFee>({
        minBillValue: '0',
        basicFee: '0',
        fractionOfBill: '0',
        fractionOfTotalTransportFee: '0',
    })

    useEffect(() => {
        if (props.fee) {
            setFee({...props.fee})
        }
    }, [props.fee])

    function setMinBillValue(value: string) {
        if (fee) {
            fee.minBillValue = value
            props.onChange(fee)
        }
    }

    function setBasicFee(value: string) {
        if (fee) {
            fee.basicFee = value
            props.onChange(fee)
        }
    }

    function setFractionOfBill(value: string) {
        if (fee) {
            fee.fractionOfBill = value
            props.onChange(fee)
        }
    }

    function setFractionOfTotalTransportFee(value: string) {
        if (fee) {
            fee.fractionOfTotalTransportFee = value
            props.onChange(fee)
        }
    }

    return <section className="new-bill-based-transport-fee">
        <label>
            <p className="h5"> Giá trị đơn hàng tối thiểu </p>
        </label>
        <DecimalInput className="form-text-input" value={ fee?.minBillValue } onChange={e => setMinBillValue(e)}></DecimalInput>

        <label>
            <p className="h5"> Phí cơ bản </p>
        </label>
        <DecimalInput className="form-text-input" value={ fee?.basicFee } onChange={e => setBasicFee(e)}></DecimalInput>

        <label>
            <p className="h5"> Phần trăm giá trị đơn hàng </p>
        </label>
        <DecimalInput className="form-text-input" value={ fee?.fractionOfBill } onChange={e => setFractionOfBill(e)}></DecimalInput>

        <label>
            <p className="h5"> Phần trăm tổng phí vận chuyển </p>
        </label>
        <DecimalInput className="form-text-input" value={ fee?.fractionOfTotalTransportFee } onChange={e => setFractionOfTotalTransportFee(e)}></DecimalInput>
    </section>
}