import { useState } from "react";
import "./Scaffold.scss";

export interface ScaffoldProps {
    children: JSX.Element;
    sidebarMenus: string[];
    onMenuSelected(menu: string) : void;
    selectedMenu: number;
    title: string;
}

export const Scaffold = (props: ScaffoldProps) => {
    let [sidebarTranslateX, setSidebarTranslateX] = useState(0)
    let [showBlackenLayer, setShowBlackenLayer] = useState("none")

    function displaySideBar() : JSX.Element[] {
        let ret = [];
        for (let i = 0; i < props.sidebarMenus.length; i++) {
            let selected = "";
            if (props.selectedMenu === i) {
                selected = "selected";
            }
            ret.push(
                <button className={ selected } key={i} onClick={() => onMenuClick(i)}>
                        { props.sidebarMenus[i] }
                </button>
            )
        }
        return ret
    }

    function onMenuClick(index: number) {
        props.onMenuSelected(props.sidebarMenus[index])
        close()
    }

    function onShowSidebarButtonClick() {
        setSidebarTranslateX(100)
        setShowBlackenLayer("block")
    }

    function close() {
        setSidebarTranslateX(0)
        setShowBlackenLayer("none")
    }

    return <section>
        <header>
            <button className="icon-button" onClick={ onShowSidebarButtonClick }>
                <i className="fas fa-bars"></i>
            </button>
            <p>
                { props.title }
            </p>
        </header>
        <aside style={{ transform: `translate(${sidebarTranslateX}%)` }}>
            { displaySideBar() }
        </aside>
        <main>
            <div onClick={ close } style={{ display: showBlackenLayer }} className="blacken-layer">
            </div>
            { props.children }
        </main>
    </section>
}