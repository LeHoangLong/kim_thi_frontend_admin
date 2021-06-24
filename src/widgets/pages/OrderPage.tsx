import { useState } from "react"
import { Scaffold } from "../components/Scaffold"

export const OrderPage = () => {
    let [selectedMenu, setSelectedMenu] = useState(0)

    const sidebarMenus : string[] = ["Đơn hàng", "Sản phẩm", "Phí vận chuyển"]

    function onMenuSelected(menu: string) {
        setSelectedMenu(sidebarMenus.indexOf(menu))
    }

    return <Scaffold selectedMenu={selectedMenu} title="" sidebarMenus={ sidebarMenus } onMenuSelected={ onMenuSelected }>
        <p>hello</p>
    </Scaffold>
}