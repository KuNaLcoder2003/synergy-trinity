import type React from "react";
import CustomersTab from "../customers/Customers";
import SuppliersTab from "../suppliers/Suppliers";

type tabs = "Home" | "Customers" | "Suppliers" | "Orders" | "Bills"

const MainContent: React.FC<{ tab: tabs }> = ({ tab }) => {

    return (
        <div className="w-full">
            {
                tab == "Home" && <div>Home Tab</div>
            }
            {
                tab == "Customers" && <CustomersTab />
            }
            {
                tab == "Suppliers" && <SuppliersTab />
            }
            {
                tab == "Orders" && <div>Orders Tab</div>
            }
            {
                tab == "Bills" && <div>Bills Tab</div>
            }
        </div>
    )
}

export default MainContent;