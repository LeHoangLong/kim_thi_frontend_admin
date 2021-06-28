import { FormNavigationBar } from "../components/FormNavigationbar"
import '../Common.scss'
import './ProductDetailPage.scss'
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import React, { ReactNode, useState } from "react";
import { ImageGallery } from "../components/ImagGallery";
import { ImageModel } from "../../models/ImageModel";
import { EPriceUnit, PriceLevel, ProductPrice } from "../../models/ProductPrice";
const update = require('update-immutable').default

export interface ProductDetailPageProps {
    onBack() : void;
    productId? : number;
}

export const ProductDetailPage = ( props : ProductDetailPageProps ) => {
    let [showModal, setShowModal] = useState(false)
    let [showPriceModal, setShowPriceModal] = useState(false)
    let [selectdImages, setSelectedImages] = useState<ImageModel[]>([])
    let [newlyAddedImages, setNewlyAddedImages] = useState<ImageModel[]>([])
    let [prices, setPrices] = useState<ProductPrice[]>([])
    let [newPriceUnit, setNewPriceUnit] = useState(EPriceUnit.KG)
    let [newPriceDefault, setNewPriceDefault] = useState(0)

    function onOkButtonPressed() {
        props.onBack();
    }

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
                            { prices[i].priceLevels[j].price }
                        </div>
                    </div>
                )
            }
        }
        return ret
    }

    function onNewPriceCreated() {
        let newPrice : ProductPrice = {
            unit: newPriceUnit,
            defaultPrice: newPriceDefault,
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

    function displayPriceForm(
        unit: string,
        onUnitChanged: (value: string) => void,
        defaultPrice: number,
        onDefaultPriceChanged: (value: number) => void,
        priceLevels?: PriceLevel[],
        onPriceLevelsChanged?: (value: PriceLevel[]) => void,
    ) : React.ReactNode {
        function defaultPriceChangedHandler(event: React.ChangeEvent<HTMLInputElement>) {
            if (event.target.value.length == 0) {
                onDefaultPriceChanged(0)
            } else {
                let parsed = parseInt(event.target.value)
                if (parsed !== NaN) {
                    onDefaultPriceChanged(parsed)
                }
            }
        }

        return <form className="display-price-form">
            <div>
                <label htmlFor="unit">Đơn vị</label>
                <select value={ unit } onChange={(e) => onUnitChanged(e.target.value) } id="unit">
                    { displayUnitOptions() }
                </select>
            </div>
            <div>
                <label htmlFor="default-price">Giá&nbsp;mặc định</label>
                <input className="form-text-input" value={ defaultPrice } onChange={ defaultPriceChangedHandler } id="default-price" type="text"></input>
            </div>
            {(() => {
                if (priceLevels !== undefined) {
                   return <div>
                        <div>
                            <label>Số&nbsp;lượng tối&nbsp;thiểu</label>
                            <label>Giá</label>
                            { displayPriceLevels() }
                        </div>
                        <button className="add-price-level">
                            <i className="fas fa-plus"></i>
                            <p>Thêm&nbsp;mức&nbsp;giá</p>
                        </button>
                   </div> 
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

    function displayPrices() : React.ReactNode[] {
        let ret : React.ReactNode[] = []
        for (let i = 0; i < prices.length; i++) {
            let price = prices[i]
            ret.push(
                <div key={i} className="price-card">
                    { displayPriceForm(
                        price.unit,
                        (value) => updatePriceUnit(i, value),
                        price.defaultPrice,
                        (value) => updatePriceDefaultValue(i, value)
                    ) }
                </div>
            )
        }
        return ret
    }

    return <section>
        <header>
            <FormNavigationBar onBackButtonPressed={ props.onBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </header>
        <aside>
            <Modal show={ showModal } onOk={ selectdImages.length > 0? onImagesSelected : undefined } onClose={ closeModal }>
                <ImageGallery onImageClicked={ onImageClicked } selectedImages={ selectdImages }></ImageGallery>
            </Modal>

            <Modal show={ showPriceModal } onOk={ onNewPriceCreated } onClose={ () => setShowPriceModal(false) }>
                { displayPriceForm(
                    newPriceUnit,
                    setNewPriceUnit,
                    newPriceDefault,
                    setNewPriceDefault
                ) }
            </Modal>
            
        </aside>
        <main className="product-detail-page"> 
            <article>
                <h4 className="title">Thông tin chung</h4>
                <form>
                    <label htmlFor="product-id-input">
                        <h5>Mã sản phẩm</h5>
                    </label>
                    <input className="form-text-input" type="text" id="product-id-input"></input>

                    <label htmlFor="product-id-input">
                        <h5 className="required-label">Tên sản phẩm</h5>
                    </label>
                    <input className="form-text-input" type="text" id="product-id-input"></input>
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
                <div className="add-image">
                    <IconButton onClick={ onAddImageClick } className="add-image-button">
                        <h4>
                            <i className="fas fa-plus"></i>
                        </h4>
                    </IconButton>
                    { showImages() }
                </div>
            </article>
        </main>
    </section>
}