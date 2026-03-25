import type React from "react"
import { useState } from "react"
import SideBar from "./SideBar"
import MainContent from "./MainContent"

type Tabs = "Home" | "Customers" | "Suppliers" | "Orders" | "Bills"

const DashBoard: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tabs>("Home")

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <SideBar currentTab={currentTab} setSidebar={setCurrentTab} />

            {/* Main Content */}
            <MainContent tab={currentTab} />

        </div>
    )
}

export default DashBoard