import { useEffect, useState } from "react"
import { Pagination } from "../../config/Pagination"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { ProductCategoryModel } from "../../models/ProductCategoryModel"
import { EStatus } from "../../models/StatusModel"
import { addCategories, clearCategories, setNumberOfCategories, updateCategoryStateStatus } from "../../reducers/ProductCategoryReducer"
import './CategoryGallery.scss'
import Loading from "../components/Loading"
import { useContainer } from "../../container"

export interface CategoryGalleryProps {
    onProductCategoryClicked(category: ProductCategoryModel) : void;
    selectedProductCategories : ProductCategoryModel[];
}

export const CategoryGallery = (props: CategoryGalleryProps) => {
    let [isLoading, setIsLoading] = useState(false)
    let [categories, setCategories] = useState<ProductCategoryModel[]>([])
    let [selectedProductCategoryStrings, setSelectedProductCategoryStrings] = useState<string[]>([])
    let [newCategory, setNewCategory] = useState<string>("")

    let categoriesState = useAppSelector(state => state.productCategories)
    let productCategoryRepository = useContainer()[0].productCategoryRepository
    let dispatch = useAppDispatch()

    useEffect(() => {
        async function init() {
            if ( categoriesState.status.status === EStatus.INIT ) {               
                dispatch(clearCategories())
                let count = await productCategoryRepository!.getNumberOfCategories()
                dispatch(setNumberOfCategories(count))
                let categories = await productCategoryRepository!.getCategories(Pagination.DEFAULT_PAGE_SIZE, 0)
                dispatch(addCategories(categories))
            }
        }
        init()
    }, [ categoriesState.status, productCategoryRepository, dispatch ])

    useEffect(() => {
        if (categoriesState.status.status === EStatus.IN_PROGRESS) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [ categoriesState.status ])

    useEffect(() => {
        setCategories(categoriesState.categories)
    }, [categoriesState.categories])

    useEffect(() => {
        let selectedProductCategoryStrings = [];
        for (let i = 0; i < props.selectedProductCategories.length; i++) {
            selectedProductCategoryStrings.push(props.selectedProductCategories[i].category)
        }
        setSelectedProductCategoryStrings(selectedProductCategoryStrings)
    }, [props.selectedProductCategories])

    function displayCategories() : React.ReactNode {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < categories.length; i++) {
            ret.push(
                <option key={i} value={ categories[i].category } onClick={ () => onSelectedCategoryClicked(categories[i]) }> 
                    { categories[i].category } 
                </option>
            )
        }
        return ret
    }

    function onSelectedCategoryClicked(category: ProductCategoryModel) {
        props.onProductCategoryClicked({ ...category })
    }

    async function createNewCategory() {
        if (newCategory.length > 0) {
            try {
                dispatch(updateCategoryStateStatus({
                    status: EStatus.IN_PROGRESS
                }))
                let createdCategory = await productCategoryRepository!.createCategory({
                    category: newCategory
                })
                setNewCategory("")
                dispatch(addCategories([createdCategory]))
                dispatch(updateCategoryStateStatus({
                    status: EStatus.SUCCESS
                }))
            } catch (exception) {
                dispatch(updateCategoryStateStatus({
                    status: EStatus.ERROR,
                    message: (exception as any).toString(),
                }))
            } finally {
                dispatch(updateCategoryStateStatus({
                    status: EStatus.IDLE,
                }))
            }
        }
    }

    if (isLoading) {
        return <Loading></Loading>
    } else {
        return <section className="category-gallery">
            <select className="category-select" multiple={true} value={ selectedProductCategoryStrings } onChange={() => {}}>
                { displayCategories() }
            </select>
            <div className="new-category-row">
                <input onChange={e =>  setNewCategory(e.target.value)} value={ newCategory } className="body-text-1 new-category-input" type="text" placeholder="Tạo danh mục mới"></input>
                <button onClick={ createNewCategory } className="body-text-1 primary-button"> Tạo </button>
            </div>
        </section>
    }
}