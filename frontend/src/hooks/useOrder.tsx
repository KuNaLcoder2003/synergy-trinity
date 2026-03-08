import { useEffect, useState } from "react"
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`

const useOrder = (id: string) => {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    async function init() {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/order/details`, {
            method: "GET",
            body: JSON.stringify({
                orderId: id
            })
        })
        const data = await response.json()
        if (!data.valid) {
            setError(data.message)
        }
        else {
            setDocs(data.docs)
        }
        setLoading(false)

    }
    useEffect(() => {
        try {
            init().then(() => {
                console.log("Done")
            }).catch((err) => {
                console.log('Error is ', err)
            })
        } catch (error) {
            console.log(error)
            setError("Something went wrong")
        }
    }, [])
    return { loading, docs, error }
}

export default useOrder;