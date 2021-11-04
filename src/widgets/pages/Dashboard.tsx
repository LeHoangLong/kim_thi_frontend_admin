import { useState } from "react"
import { ConditionalRendering } from "../background/ConditionalRendering"
import { Scaffold } from "../components/Scaffold"
import { OrderPage } from "./OrderPage"
import { ProductPage } from "./ProductPage"
import { TransportFeePage } from "./TransportFeePage"

export const Dashboard = () => {
    let [renderedMenus, setRenderedMenus] = useState<string[]>(["Sản phẩm"])
    let [selectedMenu, setSelectedMenu] = useState(0)

    const sidebarMenus : string[] = [ "Phí vận chuyển", "Sản phẩm", "Đơn hàng"]

    function onMenuSelected(menu: string) {
        setSelectedMenu(sidebarMenus.indexOf(menu))
        if (renderedMenus.indexOf(menu) !== -1) {
            renderedMenus.push(menu)
            setRenderedMenus([...renderedMenus])
        }
    }

    return <Scaffold selectedMenu={selectedMenu} title="" sidebarMenus={ sidebarMenus } onMenuSelected={ onMenuSelected }>
        <div style={{ display: selectedMenu === 2? 'block' : 'none' }} className="h-100pc">
            <ConditionalRendering display={ renderedMenus.indexOf("Đơn hàng") !== -1 }>
                <OrderPage></OrderPage>
            </ConditionalRendering>
        </div>
        <div style={{ display: selectedMenu === 0? 'block' : 'block' }} className="h-100pc">
            <ConditionalRendering display={ renderedMenus.indexOf("Sản phẩm") !== -1 }>
                <ProductPage></ProductPage>
            </ConditionalRendering>
        </div>
        <div style={{ display: selectedMenu === 2? 'block' : 'none' }} className="h-100pc">
            <ConditionalRendering display={ renderedMenus.indexOf("Phí vận chuyển") !== -1 }>
                <TransportFeePage/>
            </ConditionalRendering>
        </div>
    </Scaffold>
}