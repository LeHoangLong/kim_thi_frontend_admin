import { FormNavigationBar } from "../components/FormNavigationbar"
import '../Common.scss'
import './ProductDetailPage.scss'
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import React, { Fragment, ReactNode, useState } from "react";
import { ImageGallery } from "../components/ImagGallery";
import { ImageModel } from "../../models/ImageModel";
import { EPriceUnit, PriceLevel, ProductPrice } from "../../models/ProductPrice";
import { NumberInput } from "../components/NumberInput";
import { ConditionalRendering } from "../background/ConditionalRendering";
import { ProductDetailModel } from "../../models/ProductDetailModel";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { push } from "../../reducers/ErrorReducer";
import { EErrorLevel } from "../../models/ErrorModel";
import Locator from "../../services/Locator";
import { IProductRepository } from "../../repositories/IProductRepository";
import Services from "../../config/Services";
import { fetchingProductDetail, fetchedProductDetail, errorProductDetail, replaceProductDetailById } from "../../reducers/ProductDetailReducer";
import { created, fetched as summaryFetched, replace } from "../../reducers/ProductSummaryReducer";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { error } from "../../reducers/ProductSummaryReducer";
import { ProductSummaryModel } from "../../models/ProductSummaryModel";
import { IImageRepository } from "../../repositories/IImageRepository";

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

    let dispatch = useAppDispatch()

    let productRepository = Locator.get<IProductRepository>(Services.PRODUCT_REPOSITORY)
    let imageRepository = Locator.get<IImageRepository>(Services.IMAGE_REPOSITORY)
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
            } catch (exception) { 
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
        clearAll();
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
                    } catch (exception) {
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
        setAvatar(null)
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
                        <h5>{ String.fromCharCode(10005) }</h5>
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
                            { prices[i].priceLevels[j].price.toLocaleString() }
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
                        <h5>Mã sản phẩm</h5>
                    </label>
                    <input value={ productSerialNumber } onChange={evt => setProductSerialNumber(evt.target.value) } className="form-text-input" type="text" id="product-id-input"></input>

                    <label htmlFor="product-id-input">
                        <h5 className="required-label">Tên sản phẩm</h5>
                    </label>
                    <input value={ productName } onChange={evt => setProductName(evt.target.value) } className="form-text-input" type="text" id="product-id-input"></input>
                </form>
            </article>

            <article>
                <h4 className="title">Đơn vị tính / giá cả</h4>
                { displayPrices() }
                <button className="primary-button add-unit-button" onClick={ () => setShowPriceModal(true) }>
                    <i className="fas fa-plus"></i>
                    <div> Thêm đơn vị </div>
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