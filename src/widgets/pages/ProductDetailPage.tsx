import { FormNavigationBar } from "../components/FormNavigationbar"
import '../Common.scss'
import './ProductDetailPage.scss'
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import React, { Fragment, ReactNode, useState } from "react";
import { ImageGallery } from "../fragments/ImagGallery";
import { ImageModel } from "../../models/ImageModel";
import { EPriceUnit, PriceLevel, ProductPrice } from "../../models/ProductPrice";
import { NumberInput } from "../components/NumberInput";
import { ConditionalRendering } from "../background/ConditionalRendering";
import { ProductDetailModel } from "../../models/ProductDetailModel";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { push } from "../../reducers/ErrorReducer";
import { EErrorLevel } from "../../models/ErrorModel";
import { IProductRepository } from "../../repositories/IProductRepository";
import Services from "../../config/Services";
import { fetchingProductDetail, fetchedProductDetail, errorProductDetail, replaceProductDetailById } from "../../reducers/ProductDetailReducer";
import { created, fetched as summaryFetched, replace } from "../../reducers/ProductSummaryReducer";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { error } from "../../reducers/ProductSummaryReducer";
import { ProductSummaryModel } from "../../models/ProductSummaryModel";
import { IImageRepository } from "../../repositories/IImageRepository";
import { CategoryGallery } from "../fragments/CategoryGallery";
import { ProductCategoryModel } from "../../models/ProductCategoryModel";
import styles from './ProductDetailPage.module.scss'
import myContainer from "../../container";

const update = require('update-immutable').default

export interface ProductDetailPageProps {
    onBack() : void;
    productId?: number;
}

export const ProductDetailPage = ( props : ProductDetailPageProps ) => {
    let [productSerialNumber, setProductSerialNumber] = useState("")
    let [productName, setProductName] = useState("")
    let [showModal, setShowModal] = useState(false)
    let [showAvatarModal, setShowAvatarModal] = useState(false)
    let [selectedAvatarImage, setSelectedAvatarImage] = useState<ImageModel[]>([])
    let [showPriceModal, setShowPriceModal] = useState(false)
    let [selectdImages, setSelectedImages] = useState<ImageModel[]>([])
    let [newlyAddedImages, setNewlyAddedImages] = useState<ImageModel[]>([])
    let [prices, setPrices] = useState<ProductPrice[]>([])
    let [newPriceUnit, setNewPriceUnit] = useState(EPriceUnit.KG)
    let [newPriceDefault, setNewPriceDefault] = useState(0)
    let [showPriceLevelModal, setShowPriceLevelModal] = useState(false)
    let [editingMinQuantity, setEditingMinQuantity] = useState(0)
    let [editingPriceLevel, setEditingPriceLevel] = useState(0)
    let [editingPriceIndex, setEditingPriceIndex] = useState(0)
    let [editingIsDefault, setEditingIsDefault] = useState(false)
    let [avatar, setAvatar] = useState<ImageModel | null>(null)
    let [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false)
    let [isFetfchingProduct, setIsFetchingProduct] = useState(false)
    let [isLoading, setIsLoading] = useState(false)
    let [productCategories, setProductCategories] = useState<ProductCategoryModel[]>([])
    let [showCategoryGallery, setShowCategoryGallery] = useState(false)
    let [editingProductCategories, setEditingProductCategories] = useState<ProductCategoryModel[]>([])
    let [wholesalePrices, setWholesalePrices] = useState<string[]>([])
    let [showNewWholesalePrice, setShowNewWholesalePrice] = useState(false)
    let [editingWholesalePrice, setEditingWholesalePrice] = useState('')
    let [editingWholesalePriceIndex, setEditingWholesalePriceIndex] = useState(-1)

    let dispatch = useAppDispatch()

    let productRepository = myContainer.get<IProductRepository>(Services.PRODUCT_REPOSITORY)
    let imageRepository = myContainer.get<IImageRepository>(Services.IMAGE_REPOSITORY)
    let images = useAppSelector(state => state.images.images)
    let productDetails = useAppSelector(state => state.productDetails.products)

    async function onOkButtonPressed() {
        if (prices.length == 0) {
            dispatch(push({
                message: "Phải có ít nhất 1 đơn vị tính",
                level: EErrorLevel.ERROR,
                timeMs: Date.now(),
            }))
        } else if (avatar === null) {
            dispatch(push({
                message: "Phải chọn ảnh đại diện",
                level: EErrorLevel.ERROR,
                timeMs: Date.now(),
            }))
        } else {
            let defaultPrice = prices.find(e => e.isDefault)
            let alternativePrices = prices.filter(e => !e.isDefault) 
            let product : ProductDetailModel = {
                id: null,
                serialNumber: productSerialNumber,
                defaultPrice: defaultPrice!,
                alternativePrices: alternativePrices,
                avatar: avatar!,
                name: productName,
                rank: 0,
                categories: productCategories,
                wholesalePrices: wholesalePrices,
            }

            try {
                if (props.productId === undefined) {
                    setIsCreatingNewProduct(true)
                    let createdProduct = await productRepository!.createProduct(product)
                    let avatar = images.find(e => e.id === createdProduct.avatar.id)
                    if (avatar === undefined) {
                        avatar = await imageRepository!.fetchImageById(createdProduct.avatar.id)
                    }
                    let summary : ProductSummaryModel = {
                        id: createdProduct.id!,
                        serialNumber: createdProduct.serialNumber,
                        name: createdProduct.name,
                        avatar: avatar,
                    }
                    dispatch(created(summary))
                    dispatch(fetchedProductDetail(createdProduct))
                } else {
                    product.id = props.productId
                    setIsCreatingNewProduct(true)
                    let createdProduct = await productRepository!.updateProduct(props.productId, product)
                    let avatar = images.find(e => e.id === createdProduct.avatar.id)
                    if (avatar === undefined) {
                        avatar = await imageRepository!.fetchImageById(createdProduct.avatar.id)
                    }
                    let summary : ProductSummaryModel = {
                        id: createdProduct.id!,
                        serialNumber: createdProduct.serialNumber,
                        name: createdProduct.name,
                        avatar: avatar,
                    }
                    dispatch(replace({
                        current: props.productId!,
                        new: summary,
                    }))
                    dispatch(replaceProductDetailById({
                        current: props.productId,
                        new: createdProduct
                    }))
                }

                goBack();
            } catch (exception: any) { 
                dispatch(push({
                    level: EErrorLevel.ERROR,
                    message: exception,
                    timeMs: Date.now(),
                }))
                if (typeof(exception) === typeof("")) {
                    dispatch(error(exception))
                } else {
                    // dispatch(error("Error"))
                }
            } finally {
                setIsCreatingNewProduct(false)
            }
        }
    }

    function goBack() {
        props.onBack();
    }

    useEffect(() => {
        async function fetchProductDetail() {
            if (props.productId !== undefined) {
                let productDetail = productDetails.find(e => e.id === props.productId)
                if (productDetail === undefined) {
                    try {
                        setIsFetchingProduct(true)
                        dispatch(fetchingProductDetail(props.productId))
                        productDetail = await productRepository!.fetchProductDetailById(props.productId)
                        dispatch(fetchedProductDetail(productDetail))
                    } catch (exception: any) {
                        dispatch(errorProductDetail(exception))
                        dispatch(push({
                            level: EErrorLevel.ERROR,
                            timeMs: Date.now(),
                            message: exception
                        }))
                        goBack()
                    } finally {
                        setIsFetchingProduct(false)
                    }
                }
                if (productDetail !== undefined) {
                    setProductSerialNumber(productDetail.serialNumber)
                    setProductName(productDetail.name)
                    setPrices([productDetail.defaultPrice].concat(productDetail.alternativePrices))
                    setAvatar(productDetail.avatar)
                    setProductCategories([...productDetail.categories])
                    setWholesalePrices(productDetail.wholesalePrices)
                }
            } else {
                clearAll()
            }
        }
        fetchProductDetail()
    }, [props.productId])

    function clearAll() {
        setProductSerialNumber("")
        setProductName("")
        setPrices([])
        setProductCategories([])
        setAvatar(null)
        setWholesalePrices([])
    }

    useEffect(() => {
        if (isCreatingNewProduct || isFetfchingProduct) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [isCreatingNewProduct])

    function onAddImageClick() {
        setShowModal(true)
    }

    function onImageClicked(image: ImageModel) {
        let index = selectdImages.indexOf(image)
        if (index !== -1) {
            selectdImages.splice(index, 1)
        } else {
            selectdImages.push(image)
        }
        setSelectedImages([...selectdImages])
    }

    function closeModal() {
        setSelectedImages([])
        setShowModal(false)
    }

    function onImagesSelected() {
        let newlyAddedImages : ImageModel[] = []
        if (props.productId !== undefined) {
        } else {
            newlyAddedImages = selectdImages
        }
        setNewlyAddedImages(newlyAddedImages)
        closeModal()
    }

    function onRemoveNewlyAddedImage(imageIndex: number) {
        newlyAddedImages.splice(imageIndex, 1)
        setNewlyAddedImages([...newlyAddedImages])
    }

    function showImages() : ReactNode[] {
        let ret : ReactNode[] = []
        for (let i = 0; i < newlyAddedImages.length; i++) {
            ret.push(
                <div key={ newlyAddedImages[i].id } className="image-container">
                    <img alt={ newlyAddedImages[i].path } src={ newlyAddedImages[i].path }></img>
                    <IconButton onClick={() => onRemoveNewlyAddedImage(i)}>
                        <p className="h5">{ String.fromCharCode(10005) }</p>
                    </IconButton>
                </div>
            )
        }
        return ret
    }

    function displayUnitOptions() : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let key in EPriceUnit) {
            ret.push(<option value={ key } key={ key }>{ EPriceUnit[key] }</option>)
        }
        return ret
    }

    function removePriceLevel(priceIndex: number, priceLevelIndex: number) {
        let newPrices = update(prices, {
            [priceIndex]: {
                priceLevels: {
                    $splice: [[priceLevelIndex, 1]]
                }
            }
        })
        setPrices(newPrices)
    }

    function displayPriceLevels() : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < prices.length; i++) {
            for (let j = 0; j < prices[i].priceLevels.length; j++) {
                ret.push(
                    <div key={ i + "_" + j }>
                        <div>
                            { prices[i].priceLevels[j].minQuantity }
                        </div>
                        <div>
                            { prices[i].priceLevels[j].price.toLocaleString('en') }
                        </div>
                        <IconButton onClick={ () => removePriceLevel(i, j)  }>
                            <i className="fas fa-times"></i>
                        </IconButton>
                    </div>
                )
            }
        }
        return ret
    }

    function removeCategory(category: ProductCategoryModel) {
        let index = productCategories.findIndex(e => e.category === category.category)
        productCategories.splice(index, 1)
        setProductCategories([...productCategories])
    }

    function displayCategories() {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < productCategories.length; i++) {
            ret.push(
                <li key={i} className="product-category">
                    <button className="icon-button" onClick={() => removeCategory(productCategories[i])}>
                        <i className="fas fa-times"></i>
                    </button>
                    <p> { productCategories[i].category } </p>
                </li>
            )
        }
        return <ul>
            { ret }
        </ul>
    }

    function onNewPriceCreated() {
        if (editingIsDefault) {
            // new default
            for (let i = 0; i < prices.length; i++) {
                prices[i] = {
                    ...prices[i],
                    isDefault: false,
                }
            }
        } else if (prices.length === 0) {
            editingIsDefault = true; // if no price, by default this is default
        }
        let newPrice : ProductPrice = {
            unit: newPriceUnit,
            defaultPrice: newPriceDefault,
            isDefault: editingIsDefault,
            priceLevels: [],
        }
        setNewPriceUnit(EPriceUnit.KG)
        setNewPriceDefault(0)
        let newPrices = update(prices, {
            $push: [newPrice]
        })
        setPrices(newPrices)
        setShowPriceModal(false)
    }

    function onAddPriceLevelButtonClicked(index: number) {
        setEditingPriceIndex(index)
        setShowPriceLevelModal(true)
    }

    function removePrice(index: number) {
        let newPrices = update(prices, {
            $splice: [[index, 1]]
        })
        setPrices(newPrices)
    }

    function displayPriceForm(
        unit: string,
        onUnitChanged: (value: string) => void,
        defaultPrice: number,
        onDefaultPriceChanged: (value: number) => void,
        isDefault: boolean,
        onIsDefaultChanged: (value: boolean) => void,
        priceLevels?: PriceLevel[],
        onNewPriceLevelClicked?: () => void,
    ) : React.ReactNode {
        return <form className="display-price-form">
            <div>
                <label htmlFor="unit">Đơn vị</label>
                <select value={ unit } onChange={(e) => onUnitChanged(e.target.value) } id="unit">
                    { displayUnitOptions() }
                </select>
            </div>
            <div>
                <label htmlFor="default-price">Giá&nbsp;mặc&nbsp;định</label>
                <NumberInput className="form-text-input" value={ defaultPrice } onChange={ onDefaultPriceChanged } id="default-price"></NumberInput>
            </div>
            <div>
                <label htmlFor="is-default">Mặc định</label>
                <input type="checkbox" checked={ isDefault } onChange={e => onIsDefaultChanged(e.target.checked)}></input>
            </div>
            {(() => {
                if (priceLevels !== undefined) {
                   return <Fragment>
                        <div className="display-price-levels">
                            <div>
                                <label>Số&nbsp;lượng tối&nbsp;thiểu</label>
                                <label>Giá</label>
                                <div className="dummy">&nbsp;</div>
                            </div>
                            { displayPriceLevels() }
                        </div>
                        <button className="add-price-level" onClick={ onNewPriceLevelClicked }>
                            <i className="fas fa-plus"></i>
                            <p>Thêm&nbsp;mức&nbsp;giá</p>
                        </button>
                    </Fragment>
                }
            })()}
        </form>
    }

    function displayWholesalePriceForm() {
        return <form className={ styles.wholesale_price_from } onSubmit={onEditingWholesalePriceFinished}>
            <input value={ editingWholesalePrice } onChange={e => setEditingWholesalePrice(e.target.value)} className={ styles.wholesale_price_form_input } placeholder='Giá bán sỉ'></input>
        </form>
    }

    function updatePriceUnit(index: number, unit: string) {
        let newPrices = update(prices, {
            [index]: {
                unit: {
                    $set: unit
                }
            }
        })
        setPrices(newPrices)
    }

    function updatePriceDefaultValue(index: number, value: number) {
        let newPrices = update(prices, {
            [index]: {
                defaultPrice: {
                    $set: value
                }
            }
        })
        setPrices(newPrices)
    }

    function updatePriceIsDefault(index: number) {
        let currentDefaultIndex = prices.findIndex(e => e.isDefault)
        if (currentDefaultIndex !== index) {
            prices[currentDefaultIndex] = {
                ...prices[currentDefaultIndex],
                isDefault: false,
            }
            prices[index] = {
                ...prices[index],
                isDefault: true,
            }
            setPrices([...prices])
        }
    }

    function updateProductCategory(productCategory: ProductCategoryModel) {
        let index = editingProductCategories.findIndex(e => e.category === productCategory.category)
        if (index === -1) {
            editingProductCategories.push(productCategory)
        } else {
            editingProductCategories.splice(index, 1)
        }
        setEditingProductCategories([...editingProductCategories])
    }

    function addPriceLevel() {
        let priceLevel : PriceLevel = {
            minQuantity: editingMinQuantity,
            price: editingPriceLevel,
        }
        let newPrices = update(prices, {
            [editingPriceIndex]: {
                priceLevels: {
                    $push: [priceLevel]
                }
            }
        })
        setPrices(newPrices)
        setShowPriceLevelModal(false)
    }


    function displayPrices() : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < prices.length; i++) {
            let price = prices[i]
            ret.push(
                <div key={i} className="price-card">
                    <div className="remove-price-button-container">
                        <IconButton onClick={ () => removePrice(i) }>
                            <i className="fas fa-times"></i>
                        </IconButton>
                    </div>
                    { displayPriceForm(
                        price.unit,
                        (value) => updatePriceUnit(i, value),
                        price.defaultPrice,
                        (value) => updatePriceDefaultValue(i, value),
                        price.isDefault,
                        (value) => updatePriceIsDefault(i),
                        price.priceLevels,
                        () => onAddPriceLevelButtonClicked(i)
                    ) }
                </div>
            )
        }
        return ret
    }


    function removeWholesalePrice(index: number) {
        wholesalePrices.splice(index, 1)
        setWholesalePrices([...wholesalePrices])
    }

    function onWholesalePriceClickedHandler(index: number) {
        setEditingWholesalePrice(wholesalePrices[index])
        setEditingWholesalePriceIndex(index)
        setShowNewWholesalePrice(true)
    }

    function displayWholesalePrices() {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < wholesalePrices.length; i++) {
            ret.push(
                <li className={ styles.wholesale_price_row } key={ wholesalePrices[i] }>
                    <button className={ styles.icon } onClick={() => removeWholesalePrice(i)}>
                        <i className='fas fa-times'></i>
                    </button>
                    <div className={ styles.wholesale_price } onClick={() => onWholesalePriceClickedHandler(i)}>
                        <p> { wholesalePrices[i] } </p>
                    </div>
                </li>
            )
        }
        return ret
    }

    function closeAvatarModal() {
        setSelectedAvatarImage([])
        setShowAvatarModal(false)
    }

    function onAvatarImageClicked(image: ImageModel) {
        setSelectedAvatarImage([image])
    }

    function onAvatarSelected() {
        if (selectedAvatarImage.length > 0) {
            setAvatar(selectedAvatarImage[0])
        }
        closeAvatarModal()
    }

    function onProductCategoriesOk() {
        setProductCategories(productCategories.concat(editingProductCategories))
        setShowCategoryGallery(false)
    }

    function displayCategoryGallery() {
        setEditingProductCategories([...productCategories])
        setShowCategoryGallery(true)
    }

    function onNewWholesalePriceButtonClicked() {
        setShowNewWholesalePrice(true)
        setEditingWholesalePriceIndex(-1)
        setEditingWholesalePrice('')
    }

    function onEditingWholesalePriceFinished() {
        setShowNewWholesalePrice(false)
        if (editingWholesalePriceIndex == -1) {
            setWholesalePrices([...wholesalePrices, editingWholesalePrice])
        } else {
            wholesalePrices[editingPriceIndex] = editingWholesalePrice
            setWholesalePrices([...wholesalePrices])
        }
    }

    return <section>
        <header>
            <FormNavigationBar onBackButtonPressed={ goBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </header>
        <aside>
            <ConditionalRendering display={ showModal }>
                <Modal show={ showModal } onOk={ selectdImages.length > 0? onImagesSelected : undefined } onClose={ closeModal }>
                    <ImageGallery onImageClicked={ onImageClicked } selectedImages={ selectdImages }></ImageGallery>
                </Modal>
            </ConditionalRendering>

            <ConditionalRendering display={ showAvatarModal }>
                <Modal show={ showAvatarModal } onOk={ selectedAvatarImage.length > 0? onAvatarSelected : undefined } onClose={ closeAvatarModal }>
                    <ImageGallery onImageClicked={ onAvatarImageClicked } selectedImages={ selectedAvatarImage }></ImageGallery>
                </Modal>
            </ConditionalRendering>

            <Modal show={ showNewWholesalePrice } onOk={ onEditingWholesalePriceFinished } onClose={() => setShowNewWholesalePrice(false)}>
                { displayWholesalePriceForm() }
            </Modal>

            <ConditionalRendering display={ showCategoryGallery }>
                <Modal onOk={ editingProductCategories.length > 0? onProductCategoriesOk : undefined } show={ showCategoryGallery } onClose={ () => setShowCategoryGallery(false) }>
                    <CategoryGallery onProductCategoryClicked={ updateProductCategory } selectedProductCategories={ editingProductCategories }></CategoryGallery>
                </Modal>
            </ConditionalRendering>

            <Modal show={ showPriceModal } onOk={ onNewPriceCreated } onClose={ () => setShowPriceModal(false) }>
                { displayPriceForm(
                    newPriceUnit,
                    setNewPriceUnit,
                    newPriceDefault,
                    setNewPriceDefault,
                    editingIsDefault,
                    setEditingIsDefault
                ) }
            </Modal>

            <Modal show={ showPriceLevelModal } onOk={ addPriceLevel } onClose={ () => setShowPriceLevelModal(false) }>
                <form className="price-level-form">
                    <label htmlFor="min-quantity">Số lượng tối thiểu</label>
                    <NumberInput onChange={ value => setEditingMinQuantity(value) } value={ editingMinQuantity } className="form-text-input" id="min-quantity"></NumberInput>
                    <label htmlFor="price-level">Mức giá</label>
                    <NumberInput onChange={ value => setEditingPriceLevel(value) } value={ editingPriceLevel } className="form-text-input" id="price-level"></NumberInput>
                </form>
            </Modal>
        </aside>
        { isLoading? 
            <Loading></Loading> : 
            <main className="product-detail-page"> 
                <article>
                    <h4 className="title">Thông tin chung</h4>
                    <form>
                        <label htmlFor="product-id-input">
                            <p className="h5">Mã sản phẩm</p>
                        </label>
                        <input value={ productSerialNumber } onChange={evt => setProductSerialNumber(evt.target.value) } className="form-text-input h5" type="text" id="product-id-input"></input>

                        <label htmlFor="product-name-input">
                            <p className="h5 required-label">Tên sản phẩm</p>
                        </label>
                        <input value={ productName } onChange={evt => setProductName(evt.target.value) } className="form-text-input h5" type="text" id="product-name-input"></input>
                    </form>
                </article>

                <article className="product-categories">
                    <h4 className="title">Danh mục</h4>
                    { displayCategories() }

                    <button className="primary-button add-unit-button" onClick={ displayCategoryGallery }>
                        <i className="fas fa-plus"></i>
                        <div> Thêm danh mục </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">Đơn vị tính / giá bán lẻ</h4>
                    { displayPrices() }
                    <button className="primary-button add-unit-button" onClick={ () => setShowPriceModal(true) }>
                        <i className="fas fa-plus"></i>
                        <div> Thêm đơn vị </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">Giá sỉ</h4>
                    <ul>
                        { displayWholesalePrices() }
                    </ul>
                    <button className="primary-button add-unit-button" onClick={ onNewWholesalePriceButtonClicked }>
                        <i className="fas fa-plus"></i>
                        <div> Thêm giá </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">HÌnh ảnh</h4>
                    <div style={{ display: 'none' }} className="add-image">
                        <IconButton onClick={ onAddImageClick } className="add-image-button">
                            <h4>
                                <i className="fas fa-plus"></i>
                            </h4>
                        </IconButton>
                        { showImages() }
                    </div>
                    <div className="select-avatar">
                        <h6>Ảnh đại diện</h6>
                        {(() => {
                            if (avatar !== null) {
                                return <img alt={ avatar.path } src={ avatar.path }></img>
                            }
                        })()}
                        <button className="primary-button" onClick={() => setShowAvatarModal(true)}>Chọn</button>
                    </div>
                </article>
            </main>
        }
    </section>
}