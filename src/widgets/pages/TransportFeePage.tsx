
import React from 'react'
import { useState } from 'react'
import { AreaTransportFee } from '../../models/TransportFee'
import { ConditionalRendering } from '../background/ConditionalRendering'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { PageTransition } from '../components/PageTransition'
import { TransportFeeDetailPage } from './TransportFeeDetailPage'
import '../Common.scss'
import './TransportFeePage.scss'
import { TransportFeeSummariesPage } from './TransportFeeSummariesPage'

export const TransportFeePage = () => {
    let [startRenderFeeDetailpage, setStartRenderFeeDetailPage] = useState(false)
    let [showFeeDetailPage, setShowFeeDetailPage] = useState(false)
    let [selectedFeeId, setSelectedFeeId] = useState<number | null>(null)

    function onFeeSummarySelected(feeId: number) {
        setStartRenderFeeDetailPage(true)
        setSelectedFeeId(feeId)
        setShowFeeDetailPage(true)
    }

    function onNewFeeButtonClicked() {
        setStartRenderFeeDetailPage(true)
        setSelectedFeeId(null)
        setShowFeeDetailPage(true)
    }

    function onFeeUpdated(updatedFee: AreaTransportFee) {
        setSelectedFeeId(updatedFee.id)
    }

    return <React.Fragment>
        <TransportFeeSummariesPage onFeeSelected={ onFeeSummarySelected }></TransportFeeSummariesPage>
        <PageTransition show={ showFeeDetailPage } zIndex={101}>
            <ConditionalRendering display={ startRenderFeeDetailpage }>
                <TransportFeeDetailPage onFeeUpdated={ onFeeUpdated } feeId={ selectedFeeId } onBack={() => setShowFeeDetailPage(false)}></TransportFeeDetailPage>
            </ConditionalRendering>
        </PageTransition>
        <FloatingActionButton onClick={ onNewFeeButtonClicked }>
            <i className="fas fa-plus"></i>
        </FloatingActionButton>
    </React.Fragment>
} 