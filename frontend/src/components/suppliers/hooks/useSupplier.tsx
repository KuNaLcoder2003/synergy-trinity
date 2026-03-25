
type AddNewCustomerResponse = {
    valid: boolean,
    message: string
}
import { useEffect, useState } from "react"
import type { Suppliers } from "../../../types"
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
const useSuppliers = () => {
    const [suppliers, setSuppliers] = useState<Suppliers[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("");

    async function addNewSupplier(supplierDetails: Suppliers): Promise<AddNewCustomerResponse> {
        try {
            const response = await fetch(`${BACKEND_URL}/customer/newSupplier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(supplierDetails)
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
            const response = await fetch(`${BACKEND_URL}/supplier/all`)
            const data = await response.json()
            if (!data || !data.valid) {
                setSuppliers([])
                setError(data.message)
            }
            else if (data.valid && data.suppliers) {
                setSuppliers(data.suppliers)
            }
        } catch (error) {
            setSuppliers([])
            setError("Something went wrong")
        }
        setLoading(false)
    }

    useEffect(() => {
        getCustomers()
    }, [])
    return { suppliers, loading, error, addNewSupplier }
}

export default useSuppliers;