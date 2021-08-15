
import React from 'react'
import { useState } from 'react'
import { AreaTransportFee } from '../../models/TransportFee'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { PageTransition } from '../components/PageTransition'
import { TransportFeeDetailPage } from './TransportFeeDetailPage'
import './TransportFeePage.scss'
import { TransportFeeSummariesPage } from './TransportFeeSummariesPage'

export const TransportFeePage = () => {
    let [showFeeDetailPage, setShowFeeDetailPage] = useState(false)
    let [selectedFeeId, setSelectedFeeId] = useState<number | null>(null)

    function onFeeSummarySelected(feeId: number) {
        setShowFeeDetailPage(true)
    }

    return <React.Fragment>
        <TransportFeeSummariesPage onFeeSelected={ onFeeSummarySelected }></TransportFeeSummariesPage>
        <PageTransition show={showFeeDetailPage} zIndex={101}>
            <TransportFeeDetailPage feeId={ selectedFeeId } onBack={() => setShowFeeDetailPage(false)}></TransportFeeDetailPage>
        </PageTransition>
        <FloatingActionButton onClick={() => setShowFeeDetailPage(true)}>
            <i className="fas fa-plus"></i>
        </FloatingActionButton>
    </React.Fragment>
} 