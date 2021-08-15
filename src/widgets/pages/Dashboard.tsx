import { useState } from "react"
import { Scaffold } from "../components/Scaffold"
import { OrderPage } from "./OrderPage"
import { ProductPage } from "./ProductPage"
import { TransportFeePage } from "./TransportFeePage"

export const Dashboard = () => {
    let [selectedMenu, setSelectedMenu] = useState(0)

    const sidebarMenus : string[] = [ "Phí vận chuyển", "Sản phẩm", "Đơn hàng"]

    function onMenuSelected(menu: string) {
        setSelectedMenu(sidebarMenus.indexOf(menu))
    }

    return <Scaffold selectedMenu={selectedMenu} title="" sidebarMenus={ sidebarMenus } onMenuSelected={ onMenuSelected }>
        <div style={{ display: selectedMenu === 1? 'block' : 'none' }}>
            <OrderPage></OrderPage>
        </div>
        <div style={{ display: selectedMenu === 2? 'block' : 'none' }}>
            <ProductPage></ProductPage>
        </div>
        <div style={{ display: selectedMenu === 0? 'block' : 'none' }}>
            <TransportFeePage/>
        </div>
    </Scaffold>
}