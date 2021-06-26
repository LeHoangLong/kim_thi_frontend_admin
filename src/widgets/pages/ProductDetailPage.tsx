import { FormNavigationBar } from "../components/FormNavigationbar"
import '../Common.scss'
import './ProductDetailPage.scss'

export interface ProductDetailPageProps {
    onBack() : void;
}

export const ProductDetailPage = ( props : ProductDetailPageProps ) => {
    function onOkButtonPressed() {
        props.onBack();
    }

    return <section className="product-detail-page">
        <header>
            <FormNavigationBar onBackButtonPressed={ props.onBack } onOkButtonPressed={ onOkButtonPressed }></FormNavigationBar>
        </header>
        <main>
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
        </main>
    </section>
}