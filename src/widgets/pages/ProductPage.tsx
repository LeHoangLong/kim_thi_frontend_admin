import React, { useEffect, useState } from "react"
import { Pagination } from "../../config/Pagination";
import Services from "../../config/Services";
import myContainer from "../../container";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { ProductSummaryModel } from "../../models/ProductSummaryModel";
import { EStatus } from "../../models/StatusModel";
import { clear, error, fetched, fetching, setNumberOfProducts } from "../../reducers/ProductSummaryReducer";
import { IProductRepository } from "../../repositories/IProductRepository";
import { FloatingActionButton } from "../components/FloatingActionButton"
import Loading from "../components/Loading";
import { PageTransition } from "../components/PageTransition";
import { ProductDetailPage } from "./ProductDetailPage";
import './ProductPage.scss';

export const ProductPage = () => {
    let [isLoading, setIsLoading] = useState(false)
    let [showProductDetailPage, setShowProductDetailPage] = useState(false)
    let [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined)
    let [selectedPageNumber, setSelectedPageNumber] = useState(0)

    function onAddNewProductClick() {
        setShowProductDetailPage(true)
        setSelectedProductId(undefined)
    }

    let productSummaryStatus = useAppSelector((state) => state.productSummaries.status)
    let productSummaries = useAppSelector((state) => state.productSummaries.summaries)
    let productRepository = myContainer.get<IProductRepository>(Services.PRODUCT_REPOSITORY)
    let numberOfProducts = useAppSelector((state) => state.productSummaries.numberOfProducts)

    let dispatch = useAppDispatch()

    async function fetchProducts(pageNumber: number) {
        try {
            let summaries = await productRepository!.fetchProductSummaries(pageNumber * Pagination.DEFAULT_PAGE_SIZE, Pagination.DEFAULT_PAGE_SIZE)
            dispatch(fetched({
                offset: pageNumber * Pagination.DEFAULT_PAGE_SIZE, 
                objects: summaries,
            }))
        } catch (exception) {
            if (typeof(exception) == "string") {
                dispatch(error(exception))
            } else {
                throw exception
            }
        }
    }

    useEffect(() => {
        async function init() {
            dispatch(clear())
            dispatch(fetching())
            try {
                let numberOfProducts = await productRepository!.fetchNumberOfProducts()
                dispatch(setNumberOfProducts(numberOfProducts))
                let summaries = await productRepository!.fetchProductSummaries(0, Pagination.DEFAULT_PAGE_SIZE)
                dispatch(fetched({
                    offset: 0, 
                    objects: summaries,
                }))
            } catch (exception) {
                if (typeof(exception) == "string") {
                    dispatch(error(exception))
                } else {
                    throw exception
                }
            }
        }
        init()
    }, [dispatch, productRepository])

    useEffect(() => {
        if (productSummaryStatus.status === EStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [productSummaryStatus]);

    function onProductClicked(summary: ProductSummaryModel) {
        setShowProductDetailPage(true)
        setSelectedProductId(summary.id)
    }

    useEffect(() => {
        if (selectedPageNumber > 0) {
            let maxProductIndex = (selectedPageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE
            if (maxProductIndex > numberOfProducts) {
                maxProductIndex = numberOfProducts
            }
            
            if (maxProductIndex >= productSummaries.length || 
                (productSummaries[maxProductIndex - 1] === undefined)
            ) {
                fetchProducts(selectedPageNumber)
            }
        }
    }, [selectedPageNumber])

    function displayPageNumbers() {
        let ret : React.ReactNode[] = []
        if (numberOfProducts > 0) {
            let min = selectedPageNumber - 3
            if (min < 0) {
                min = 0
            }
            let max = selectedPageNumber + 3
            if (max > numberOfProducts / Pagination.DEFAULT_PAGE_SIZE) {
                max = numberOfProducts / Pagination.DEFAULT_PAGE_SIZE
            }
            for (let i = min; i < max; i++) {
                let className = "not-selected-page"
                if (i === selectedPageNumber) {
                    className = "selected-page"
                }
                ret.push(
                    <button key={i} className={ className } onClick={() => setSelectedPageNumber(i)}>
                        { i }
                    </button>
                )
            }
            return ret
        }
    }

    function displayProductSummaries() : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        let minProductIndex = selectedPageNumber * Pagination.DEFAULT_PAGE_SIZE
        let maxProductIndex = (selectedPageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE
        
        for (let i = minProductIndex; i < maxProductIndex; i++) {
            let summary = productSummaries[i]
            if (summary !== undefined) {
                ret.push(
                    <li key={ summary.id } className="product-summary" onClick={ () => onProductClicked(summary!) }>
                        <img src={ summary.avatar.path }></img>
                        <div className="summary">
                            <div className="summary-field">
                                <strong>
                                    ID:
                                </strong>
                                <p>
                                    { summary.serialNumber }
                                </p>
                            </div>
                            <div className="summary-field">
                                <strong>
                                    Tên:
                                </strong>
                                <p>
                                    { summary.name }
                                </p>
                            </div>
                        </div>
                    </li>
                )
            }
        }
        return ret
    }
    
    return <div className="product-page">
        <section>
            {(() => {
                if (isLoading) {
                    return <div className="loading-container">
                        <Loading></Loading>
                    </div>
                } else {
                    return <article>
                        <ul className="product-summaries">
                            { displayProductSummaries() }
                        </ul>
                        <footer className="product-page-numbers">
                            { displayPageNumbers() }
                        </footer>
                    </article> 
                }
            })()}
            <FloatingActionButton onClick={ onAddNewProductClick }>
                <i className="fas fa-plus"></i>
            </FloatingActionButton>
        </section>
        <PageTransition show={ showProductDetailPage } zIndex={ 101 }>
            <ProductDetailPage productId={ selectedProductId } onBack={ () => setShowProductDetailPage(false) }></ProductDetailPage>
        </PageTransition>
    </div>
} 