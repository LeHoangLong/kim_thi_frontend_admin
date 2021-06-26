import { HashRouter, Route, Switch } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard"

export const Router = () => {
    return <HashRouter>
        <Switch>
            <Route>
                <Dashboard></Dashboard>
            </Route>
        </Switch>
    </HashRouter>
}