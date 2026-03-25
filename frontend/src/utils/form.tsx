import { Building, LocateIcon, Mail, PaperclipIcon, Phone, PinIcon, User } from "lucide-react"
import type React from "react"
type Key = "First Name" | "Last Name" | "Email" | "Mobile" | "Pin Code" | "Company Name" | "Company Address" | "Country" | "State" | "GST Number" | "Pan Card"
type CUSTOMER_SUPPLIER_FORM = {
    [key in Key]: React.ReactNode
}

const FORMICONS: CUSTOMER_SUPPLIER_FORM = {
    "First Name": <User size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Last Name": <User size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Email": <Mail size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Mobile": <Phone size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Pin Code": <PinIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Company Name": <Building size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Company Address": <LocateIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Country": <LocateIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "State": <LocateIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "Pan Card": <PaperclipIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />,
    "GST Number": <PaperclipIcon size={16} style={{
        color: "oklch(69.6% 0.17 162.48)"
    }} />
}

export const SubmitButton: React.FC<{ onClick: () => Promise<void>, type: "Customer" | "Supplier" }> = ({ onClick, type }) => {
    return (

        <button
            onClick={onClick}
            className="bg-white text-center w-52 mx-auto rounded-2xl h-14 relative text-black text-xl font-semibold group"
            type="submit"
        >
            <div
                className="bg-green-400 rounded-xl h-12 w-1/5 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[200px] z-10 duration-500 cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    height="25px"
                    width="25px"
                >
                    <path
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                        fill="#000000"
                    ></path>
                    <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                        fill="#000000"
                    ></path>
                </svg>
            </div>
            <p className="translate-x-2 ml-10">Add {type}</p>
        </button>
    )
}

export const InputFeilds: React.FC<{ placeholder: string, type: "text" | "password", label: Key, onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void, value: string }> = ({ placeholder, type, onChange, value, label }) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <div>{FORMICONS[label]}</div>
                <p>{label}</p>
            </div>
            <input value={value} onChange={(e) => onChange(e)} type={type} placeholder={placeholder} className="
                                                w-full px-4 py-3 rounded-xl
                                                bg-gray-50
                                                border border-gray-200
                                                text-sm
                                                outline-none
                                                transition-all duration-200
                                                focus:border-emerald-500
                                                focus:ring-2 focus:ring-emerald-100
                                                hover:border-gray-300" />
        </div>
    )
}
export const TextArea: React.FC<{ placeholder: string, label: Key, onChange: (e: React.ChangeEvent<HTMLTextAreaElement, HTMLInputElement>) => void, value: string }> = ({ placeholder, onChange, value, label }) => {
    return (
        <div className="w-full p-1 flex flex-col items-baseline gap-2">
            <div className="flex items-center gap-2">
                <div>{FORMICONS[label]}</div>
                <p>{label}</p>
            </div>
            <textarea value={value} rows={5} onChange={(e) => onChange(e)} placeholder={placeholder} className="
    w-full px-4 py-3 rounded-xl
    bg-gray-50
    border border-gray-200
    text-sm
    resize-none
    outline-none
    transition-all duration-200
    focus:border-emerald-500
    focus:ring-2 focus:ring-emerald-100
  " />
        </div>
    )
}

export const DropDowns: React.FC<{ label: Key, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void, list: { flag: string, name: string }[] }> = ({ onChange, value, list, label }) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <div>{FORMICONS[label]}</div>
                <p>{label}</p>
            </div>
            <select className="
    w-full px-4 py-3 rounded-xl
    bg-gray-50
    border border-gray-200
    text-sm
    outline-none
    transition-all duration-200
    focus:border-emerald-500
    focus:ring-2 focus:ring-emerald-100
  " onChange={(e) => onChange(e)} value={value}>
                <option value={""}>---- Select Country ----</option>
                {
                    list.map((obj) => {
                        return (
                            <option className="w-full flex items-center gap-4" value={(obj.name)}>
                                <img className="w-16" src={obj.flag} />
                                <p>{obj.name}</p>
                            </option>
                        )
                    })
                }
            </select>
        </div>
    )
}

