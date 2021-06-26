import { FormNavigationBar } from "../components/FormNavigationbar"
import '../Common.scss'
import './ProductDetailPage.scss'
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import { useState } from "react";
import { ImageGallery } from "../components/ImagGallery";

export interface ProductDetailPageProps {
    onBack() : void;
}

export const ProductDetailPage = ( props : ProductDetailPageProps ) => {
    let [showModal, setShowModal] = useState(false)

    function onOkButtonPressed() {
        props.onBack();
    }

    function onAddImageClick() {
        setShowModal(true)
    }

    return <section>
        <header>
            <FormNavigationBar onBackButtonPressed={ props.onBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </header>
        <aside>
            <Modal show={ showModal } onClose={() => setShowModal(false)}>
                <ImageGallery></ImageGallery>
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
                <h4 className="title">HÌnh ảnh</h4>
                <div className="add-image">
                    <IconButton onClick={ onAddImageClick } className="add-image-button">
                        <h4>
                            <i className="fas fa-plus"></i>
                        </h4>
                    </IconButton>
                </div>
            </article>
        </main>
    </section>
}