import { useEffect, useState } from "react"
type supplier = {
    id: string;
    name: string;
    company_name: string;
    mobile: string;
    email: string;
    bank_details: string;
    country: string;
    pincode: string;
};
type customer = {
    id: string;
    name: string;
    company_name: string;
    mobile: string;
    email: string;
    bank_details: string;
    country: string;
    pincode: string;
    state: string;
};
type Order = {
    id: string;
    supplier_id: string;
    customer_id: string;
    status: string;
    material_description: string;
    port_of_loading: string;
    port_of_deloading: string;
    destination: string;
    supplier: supplier;
    customer: customer;
}
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
const useDetails = () => {
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)
    const [inwardPayment, setInwardPayment] = useState({
        amount: 0,
        no_of_payments: 0
    })
    const [outwardPayment, setOutwardPayment] = useState({
        amount: 0,
        no_of_payments: 0
    })
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        try {
            setLoading(true)
            fetch(`${BACKEND_URL}/company/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (response: Response) => {
                const data = await response.json()
                if (!data.valid) {
                    setLoading(false)
                    // handle error and display error message
                } else {
                    setInwardPayment({
                        amount: data.inward_amount,
                        no_of_payments: data.total_inward_payments
                    })
                    setOutwardPayment({
                        amount: data.outward_amount,
                        no_of_payments: data.total_outward_payments
                    })
                    setTotalOrders(data.orders.length)
                    setOrders(data.orders)
                    setLoading(false)
                }
            })
        } catch (error) {
            setLoading(false)
        }
    }, [])
    return { orders, loading, inwardPayment, outwardPayment, totalOrders }

}

export default useDetails;