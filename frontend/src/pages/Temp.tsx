import type React from "react"
import { useState } from "react"

const Temp: React.FC = () => {
    const submitHandler = async () => {
        const formData = new FormData()
        if (!file || !file1) {
            return
        }
        formData.append("doc", file)
        formData.append("doc", file1)
        formData.append("orderId", "69a6dbab38bc6a5c026d1fea")
        formData.append("docs_details", JSON.stringify([
            {
                gross_weight: 2400,
                net_weight: 2400,
                issued_by: "Synergy",
                doc_name: "CI for order - ... , dated on - ....",
                doc_type: "Commercial Invoice",
                total_value: "USD 3459",
                clearing_price: "USD 150",
                created_at: (new Date()).toString(),
            },
            {
                gross_weight: 2400,
                net_weight: 2400,
                issued_by: "Shipping Line",
                doc_name: "Seaway Bill for order : ---------",
                doc_type: "Bill of lading",
                total_value: "USD 3459",
                clearing_price: "USD 150",
                created_at: (new Date()).toString(),
            }
        ]))

        try {
            const response = await fetch('http://localhost:4000/api/v1/order/addDocs', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            console.log(data)
        } catch (error) {

        }
    }
    const [file, setFile] = useState<File | null>(null)
    const [file1, setFile1] = useState<File | null>(null)

    return (
        <div className="">
            <input type="file" onChange={(e) => {
                if (e.target.files) {
                    setFile(e.target.files[0])
                }

            }} />
            <input type="file" onChange={(e) => {
                if (e.target.files) {
                    setFile1(e.target.files[0])
                }

            }} />
            <button className="text-black" onClick={submitHandler}>
                Submit
            </button>
        </div>
    )
}

export default Temp