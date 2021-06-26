import { useState } from "react"
import { Scaffold } from "../components/Scaffold"
import { OrderPage } from "./OrderPage"
import { ProductPage } from "./ProductPage"

export const Dashboard = () => {
    let [selectedMenu, setSelectedMenu] = useState(0)

    const sidebarMenus : string[] = ["Sản phẩm", "Đơn hàng", "Phí vận chuyển"]

    function onMenuSelected(menu: string) {
        setSelectedMenu(sidebarMenus.indexOf(menu))
    }

    return <Scaffold selectedMenu={selectedMenu} title="" sidebarMenus={ sidebarMenus } onMenuSelected={ onMenuSelected }>
        <div style={{ display: selectedMenu === 1? 'block' : 'none' }}>
            <OrderPage></OrderPage>
        </div>
        <div style={{ display: selectedMenu === 0? 'block' : 'none' }}>
            <ProductPage></ProductPage>
        </div>
    </Scaffold>
}