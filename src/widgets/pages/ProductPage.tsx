import { useEffect, useState } from "react"
import { Pagination } from "../../config/Pagination";
import Services from "../../config/Services";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { EStatus } from "../../models/StatusModel";
import { clear, error, fetched, fetching, setNumberOfProducts } from "../../reducers/ProductSummaryReducer";
import { IProductRepository } from "../../repositories/IProductRepository";
import Locator from "../../services/Locator";
import { FloatingActionButton } from "../components/FloatingActionButton"
import Loading from "../components/Loading";
import { PageTransition } from "../components/PageTransition";
import { ProductDetailPage } from "./ProductDetailPage";
import './ProductPage.scss';

export const ProductPage = () => {
    let [isLoading, setIsLoading] = useState(false)
    let [showProductDetailPage, setShowProductDetailPage] = useState(false)

    function onClick() {
        console.log('on click')
        setShowProductDetailPage(true)
    }

    let productSummaryStatus = useAppSelector((state) => state.productSummaries.status)
    // let productSummaries = useAppSelector((state) => state.productSummaries.summaries)
    let productRepository = Locator.get<IProductRepository>(Services.PRODUCT_REPOSITORY)
    let dispatch = useAppDispatch()

    useEffect(() => {
        async function init() {
            dispatch(clear())
            dispatch(fetching())
            try {
                let numberOfProducts = await productRepository!.fetchNumberOfProducts()
                dispatch(setNumberOfProducts(numberOfProducts))
                let summaries = await productRepository!.fetchProductSummaries(0, Pagination.DEFAULT_PAGE_SIZE)
                dispatch(fetched(summaries))
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


    
    return <div className="product-page">
        <section>
            {(() => {
                if (isLoading) {
                    return <div className="loading-container">
                        <Loading></Loading>
                    </div>
                } else {
                    return <div>hello</div>
                }
            })()}
            <FloatingActionButton onClick={ onClick }></FloatingActionButton>
        </section>
        <PageTransition show={ showProductDetailPage } zIndex={ 101 }>
            <ProductDetailPage onBack={ () => setShowProductDetailPage(false) }></ProductDetailPage>
        </PageTransition>
    </div>
} 