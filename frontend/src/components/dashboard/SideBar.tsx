import { HomeIcon, ListOrdered, Receipt, Truck, User } from "lucide-react"
import type React from "react"

type SideBarType = "Home" | "Customers" | "Suppliers" | "Orders" | "Bills"

type Items = {
    id: string,
    label: SideBarType,
    logo: React.ReactNode
}

const SIDEBAR_ITEMS: Items[] = [
    { id: "1", label: "Home", logo: <HomeIcon size={18} /> },
    { id: "2", label: "Customers", logo: <User size={18} /> },
    { id: "3", label: "Suppliers", logo: <Truck size={18} /> },
    { id: "4", label: "Orders", logo: <ListOrdered size={18} /> },
    { id: "5", label: "Bills", logo: <Receipt size={18} /> },
]

const SideBar: React.FC<{ setSidebar: React.Dispatch<React.SetStateAction<SideBarType>>, currentTab: SideBarType }> = ({ setSidebar, currentTab }) => {

    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">


            <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold tracking-tight text-gray-800">
                    Dashboard Tool
                </h2>
            </div>


            <div className="flex flex-col gap-1 p-3">
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = currentTab === item.label

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setSidebar(item.label)
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                                ${isActive
                                    ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `}
                        >
                            <span className={`${isActive ? "text-emerald-500" : "text-gray-500"}`}>
                                {item.logo}
                            </span>
                            {item.label}
                        </button>
                    )
                })}
            </div>


            <div className="mt-auto p-4">
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                    <p className="font-medium text-gray-700">Logged in</p>
                    <p>kunal@example.com</p>
                </div>
            </div>
        </aside>
    )
}

export default SideBar