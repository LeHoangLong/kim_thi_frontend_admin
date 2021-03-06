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
import { fetchingProductDetail, fetchedProductDetail, errorProductDetail, replaceProductDetailById } from "../../reducers/ProductDetailReducer";
import { created, replace } from "../../reducers/ProductSummaryReducer";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { error } from "../../reducers/ProductSummaryReducer";
import { ProductSummaryModel } from "../../models/ProductSummaryModel";
import { CategoryGallery } from "../fragments/CategoryGallery";
import { ProductCategoryModel } from "../../models/ProductCategoryModel";
import styles from './ProductDetailPage.module.scss'
import { useContainer } from "../../container";

const update = require('update-immutable').default

export interface ProductDetailPageProps {
    onBack() : void;
    productId?: number;
}

export const ProductDetailPage = ( props : ProductDetailPageProps ) => {
    let onBack = props.onBack
    let [productSerialNumber, setProductSerialNumber] = useState("")
    let [productName, setProductName] = useState("")
    let [showModal, setShowModal] = useState(false)
    let [showAvatarModal, setShowAvatarModal] = useState(false)
    let [selectedAvatarImage, setSelectedAvatarImage] = useState<ImageModel[]>([])
    let [showPriceModal, setShowPriceModal] = useState(false)
    let [selectedImages, setSelectedImages] = useState<ImageModel[]>([])
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


    let [description, setDescription] = useState('')

    let dispatch = useAppDispatch()

    let { productRepository, imageRepository } = useContainer()[0]
    let images = useAppSelector(state => state.images.images)
    let productDetails = useAppSelector(state => state.productDetails.products)

    async function onOkButtonPressed() {
        if (avatar === null) {
            dispatch(push({
                message: "Ph???i ch???n ???nh ?????i di???n",
                level: EErrorLevel.ERROR,
                timeMs: Date.now(),
            }))
        } else {
            let defaultPrice = prices.find(e => e.isDefault)
            let alternativePrices = prices.filter(e => !e.isDefault) 
            let product : ProductDetailModel = {
                id: null,
                serialNumber: productSerialNumber,
                defaultPrice: defaultPrice,
                alternativePrices: alternativePrices,
                avatar: avatar!,
                name: productName,
                rank: 0,
                categories: productCategories,
                wholesalePrices: wholesalePrices,
                description,
                images: newlyAddedImages,
            }

            try {
                if (props.productId === undefined) {
                    setIsCreatingNewProduct(true)
                    let createdProduct = await productRepository!.createProduct(product)
                    let avatar = images.find(e => e?.id === createdProduct.avatar.id)
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
                    let avatar = images.find(e => e?.id === createdProduct.avatar.id)
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

                props.onBack();
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
                        console.log('exception')
                        console.log(exception)
                        dispatch(errorProductDetail(exception))
                        dispatch(push({
                            level: EErrorLevel.ERROR,
                            timeMs: Date.now(),
                            message: exception
                        }))
                        onBack();
                    } finally {
                        setIsFetchingProduct(false)
                    }
                }
                if (productDetail !== undefined) {
                    setProductSerialNumber(productDetail.serialNumber)
                    setProductName(productDetail.name)
                    if (productDetail.defaultPrice) {
                        setPrices([productDetail.defaultPrice].concat(productDetail.alternativePrices))
                    } else {
                        setPrices(productDetail.alternativePrices)
                    }
                    setAvatar(productDetail.avatar)
                    setProductCategories([...productDetail.categories])
                    setWholesalePrices(productDetail.wholesalePrices)
                    setDescription(productDetail.description)
                    setNewlyAddedImages(productDetail.images)
                }
            } else {
                clearAll()
            }
        }
        fetchProductDetail()
    }, [props.productId, dispatch, productDetails, productRepository, onBack])

    function clearAll() {
        setProductSerialNumber("")
        setProductName("")
        setPrices([])
        setProductCategories([])
        setAvatar(null)
        setWholesalePrices([])
        setDescription("")
        setNewlyAddedImages([])
    }

    useEffect(() => {
        if (isCreatingNewProduct || isFetfchingProduct) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [isCreatingNewProduct, isFetfchingProduct])

    function onAddImageClick() {
        setShowModal(true)
    }

    function onImageClicked(image: ImageModel) {
        let index = selectedImages.indexOf(image)
        if (index !== -1) {
            selectedImages.splice(index, 1)
        } else {
            selectedImages.push(image)
        }
        setSelectedImages([...selectedImages])
    }

    function closeModal() {
        setSelectedImages([])
        setShowModal(false)
    }

    function onImagesSelected() {
        let _newlyAddedImages = [...newlyAddedImages]
        for (let i = 0; i < selectedImages.length; i++) {
            if (_newlyAddedImages.findIndex(e => e.id === selectedImages[i].id) === -1) {
                _newlyAddedImages.push(selectedImages[i])
            }
        }
        setNewlyAddedImages([..._newlyAddedImages])
        closeModal()
    }

    function onRemoveNewlyAddedImage(imageIndex: number) {
        let _newlyAddedImages = [...newlyAddedImages]
        _newlyAddedImages.splice(imageIndex, 1)
        setNewlyAddedImages(_newlyAddedImages)
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

    function displayPriceLevels(productIndex: number, priceLevels: PriceLevel[]) : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let j = 0; j < priceLevels.length; j++) {
            ret.push(
                <div key={ j }>
                    <div>
                        { priceLevels[j].minQuantity }
                    </div>
                    <div>
                        { priceLevels[j].price.toLocaleString('en') }
                    </div>
                    <IconButton onClick={ () => removePriceLevel(productIndex, j)  }>
                        <i className="fas fa-times"></i>
                    </IconButton>
                </div>
            )
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
        productIndex?: number, 
        priceLevels?: PriceLevel[],
        onNewPriceLevelClicked?: () => void,
    ) : React.ReactNode {
        return <form className="display-price-form" onSubmit={e => { e.preventDefault(); onNewPriceCreated(); }}>
            <div>
                <label htmlFor="unit">????n v???</label>
                <select value={ unit } onChange={(e) => onUnitChanged(e.target.value) } id="unit">
                    { displayUnitOptions() }
                </select>
            </div>
            <div>
                <label htmlFor="default-price">Gi??&nbsp;m???c&nbsp;?????nh</label>
                <NumberInput className="form-text-input" value={ defaultPrice } onChange={ onDefaultPriceChanged } id="default-price"></NumberInput>
            </div>
            <div>
                <label htmlFor="is-default">M???c ?????nh</label>
                <input type="checkbox" checked={ isDefault } onChange={e => onIsDefaultChanged(e.target.checked)}></input>
            </div>
            {(() => {
                if (priceLevels !== undefined && productIndex !== undefined) {
                   return <Fragment>
                        <div className="display-price-levels">
                            <div>
                                <label>S???&nbsp;l?????ng t???i&nbsp;thi???u</label>
                                <label>Gi??</label>
                                <div className="dummy">&nbsp;</div>
                            </div>
                            { displayPriceLevels(productIndex, priceLevels) }
                        </div>
                        <button className="add-price-level" onClick={ onNewPriceLevelClicked }>
                            <i className="fas fa-plus"></i>
                            <p>Th??m&nbsp;m???c&nbsp;gi??</p>
                        </button>
                    </Fragment>
                }
            })()}
        </form>
    }

    function displayWholesalePriceForm() {
        return <form className={ styles.wholesale_price_from } onSubmit={onEditingWholesalePriceFinished}>
            <input value={ editingWholesalePrice } onChange={e => setEditingWholesalePrice(e.target.value)} className={ styles.wholesale_price_form_input } placeholder='Gi?? b??n s???'></input>
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
                        i,
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
        let newCategories = [...productCategories]
        editingProductCategories.forEach(e => {
            if (newCategories.findIndex(current => current.category === e.category) === -1) {
                newCategories.push(e)
            }
        })
        setProductCategories(newCategories)
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
        if (editingWholesalePriceIndex === -1) {
            setWholesalePrices([...wholesalePrices, editingWholesalePrice])
        } else {
            wholesalePrices[editingPriceIndex] = editingWholesalePrice
            setWholesalePrices([...wholesalePrices])
        }
    }

    return <section>
        <header>
            <FormNavigationBar onBackButtonPressed={ props.onBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </header>
        <aside>
            <ConditionalRendering display={ showModal }>
                <Modal show={ showModal } onOk={ selectedImages.length > 0? onImagesSelected : undefined } onClose={ closeModal }>
                    <ImageGallery onImageClicked={ onImageClicked } selectedImages={ selectedImages }></ImageGallery>
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
                    <label htmlFor="min-quantity">S??? l?????ng t???i thi???u</label>
                    <NumberInput onChange={ value => setEditingMinQuantity(value) } value={ editingMinQuantity } className="form-text-input" id="min-quantity"></NumberInput>
                    <label htmlFor="price-level">M???c gi??</label>
                    <NumberInput onChange={ value => setEditingPriceLevel(value) } value={ editingPriceLevel } className="form-text-input" id="price-level"></NumberInput>
                </form>
            </Modal>
        </aside>
        { isLoading? 
            <Loading></Loading> : 
            <main className="product-detail-page"> 
                <article>
                    <h4 className="title">Th??ng tin chung</h4>
                    <form onSubmit={e => e.preventDefault()} className={ styles.product_general_info_form }>
                        <label htmlFor="product-id-input">
                            <p className="h5">M?? s???n ph???m</p>
                        </label>
                        <input value={ productSerialNumber } onChange={evt => setProductSerialNumber(evt.target.value) } className="form-text-input h5" type="text" id="product-id-input"></input>

                        <label htmlFor="product-name-input">
                            <p className="h5 required-label">T??n s???n ph???m</p>
                        </label>
                        <input value={ productName } onChange={evt => setProductName(evt.target.value) } className="form-text-input h5" type="text" id="product-name-input"></input>

                        <label htmlFor="product-description-input">
                            <p className="h5">Mi??u t???</p>
                        </label>
                        <textarea value={ description } onChange={evt => setDescription(evt.target.value) } className="form-text-input h5" rows={5} id="product-description-input"></textarea>
                    </form>
                </article>

                <article className="product-categories">
                    <h4 className="title">Danh m???c</h4>
                    { displayCategories() }

                    <button className="primary-button add-unit-button" onClick={ displayCategoryGallery }>
                        <i className="fas fa-plus"></i>
                        <div> Th??m danh m???c </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">????n v??? t??nh / gi?? b??n l???</h4>
                    { displayPrices() }
                    <button className="primary-button add-unit-button" onClick={ () => setShowPriceModal(true) }>
                        <i className="fas fa-plus"></i>
                        <div> Th??m ????n v??? </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">Gi?? s???</h4>
                    <ul>
                        { displayWholesalePrices() }
                    </ul>
                    <button className="primary-button add-unit-button" onClick={ onNewWholesalePriceButtonClicked }>
                        <i className="fas fa-plus"></i>
                        <div> Th??m gi?? </div>
                    </button>
                </article>

                <article>
                    <h4 className="title">H??nh ???nh</h4>
                    <div className="add-image">
                        <IconButton onClick={ onAddImageClick } className="add-image-button">
                            <h4>
                                <i className="fas fa-plus"></i>
                            </h4>
                        </IconButton>
                        { showImages() }
                    </div>
                    <div className="select-avatar">
                        <h6>???nh ?????i di???n</h6>
                        {(() => {
                            if (avatar !== null) {
                                return <img alt={ avatar.path } src={ avatar.path }></img>
                            }
                        })()}
                        <button className="primary-button" onClick={() => setShowAvatarModal(true)}>Ch???n</button>
                    </div>
                </article>
            </main>
        }
    </section>
}