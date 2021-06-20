import { HashRouter, Route, Switch } from "react-router-dom"
import { OrderPage } from "../pages/OrderPage"

export const Router = () => {
    return <HashRouter>
        <Switch>
            <Route>
                <OrderPage></OrderPage>
            </Route>
        </Switch>
    </HashRouter>
}