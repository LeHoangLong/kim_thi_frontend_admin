import { HashRouter, Route, Switch } from "react-router-dom"
import { ErrorDisplay } from "../components/ErrorDisplay"
import { Dashboard } from "../pages/Dashboard"

export const Router = () => {
    return <ErrorDisplay>
        <HashRouter>
            <Switch>
                <Route>
                    <Dashboard></Dashboard>
                </Route>
            </Switch>
        </HashRouter>
    </ErrorDisplay> 
}