
type AddNewCustomerResponse = {
    valid: boolean,
    message: string
}
import { useEffect, useState } from "react"
import type { Customers } from "../../../types"
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
const useCutomers = () => {
    const [customers, setCutomers] = useState<Customers[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("");

    async function addNewCustomer(customerDetails: Customers): Promise<AddNewCustomerResponse> {
        try {
            const response = await fetch(`${BACKEND_URL}/customer/newCustomer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerDetails)
            })
            const data = await response.json()

            if (data && data.valid) {
                return {
                    valid: true,
                    message: data.message
                }
            }
            return {
                valid: false,
                message: data.message
            }

        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: "Something went wrong"
            }
        }
    }
    async function getCustomers() {
        setLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/customer/all`)
            const data = await response.json()
            if (!data || !data.valid) {
                setCutomers([])
                setError(data.message)
            }
            else if (data.valid && data.customers) {
                setCutomers(data.customers)
            }
        } catch (error) {
            setCutomers([])
            setError("Something went wrong")
        }
        setLoading(false)
    }

    useEffect(() => {
        getCustomers()
    }, [])
    return { customers, loading, error, addNewCustomer }
}

export default useCutomers;