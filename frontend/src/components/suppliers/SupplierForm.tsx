import type React from "react";
import { useState } from "react";
import useCountries from "../../hooks/useCountries";
import { DropDowns, InputFeilds, SubmitButton, TextArea } from "../../utils/form";
import { Loader, X } from "lucide-react";
type Supplier = {
    first_name: string;
    last_name: string;
    mobile: string;
    company_name: string;
    company_address: string;
    email: string;
    bank_details: string;
    country: string;
    state: string;
    pin_code: string;
    pan_no: string,
    gst_no: string,
}
const SupplierForm: React.FC<{ onClose: React.Dispatch<React.SetStateAction<boolean>> }> = ({ onClose }) => {
    const [supplierDetails, setCustomerDetails] = useState<Supplier>({
        first_name: "",
        last_name: "",
        mobile: "",
        company_name: "",
        company_address: "",
        email: "",
        bank_details: "",
        country: "",
        state: "",
        pin_code: "",
        pan_no: "",
        gst_no: "",
    })
    const { loading, countries } = useCountries()
    const [country, setCountry] = useState<string>("")
    const submit = async () => {

    }
    return (
        <>
            {
                loading && !countries ? <div className="w-full h-full flex items-center justify-center">
                    <Loader style={{
                        color: "oklch(69.6% 0.17 162.48)"
                    }} />
                </div> : <div className="w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200">
                    <div className="w-full flex justify-between items-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">New Supplier</h2>
                        <X onClick={() => onClose(false)} color="red" className="cursor-pointer" size={15} />
                    </div>
                    <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">

                        <InputFeilds placeholder="Enter First name" label="First Name" type="text" value={supplierDetails.first_name} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                first_name: e.target.value
                            })
                        }} />
                        <InputFeilds placeholder="Enter Last Name" label="Last Name" type="text" value={supplierDetails.last_name} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                last_name: e.target.value
                            })
                        }} />


                        <InputFeilds placeholder="Enter Email" label="Email" type="text" value={supplierDetails.email} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                email: e.target.value
                            })
                        }} />
                        <InputFeilds placeholder="Enter Mobile" label="Mobile" type="text" value={supplierDetails.mobile} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                mobile: e.target.value
                            })
                        }} />

                        <div className="md:col-span-2">
                            <InputFeilds placeholder="Enter Company Name" label="Company Name" type="text" value={supplierDetails.email} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                                setCustomerDetails({
                                    ...supplierDetails,
                                    company_name: e.target.value
                                })
                            }} />

                        </div>
                        <div className="md:col-span-2">
                            <TextArea label="Company Address" placeholder="Enter Company Adsress" value={supplierDetails.company_address} onChange={(e) => {
                                setCustomerDetails({
                                    ...supplierDetails,
                                    company_address: e.target.value
                                })
                            }} />
                        </div>
                        <div className="md:col-span-2">
                            <DropDowns label="Country" value={country} onChange={(e) => setCountry(e.target.value)} list={countries} />
                        </div>

                        <InputFeilds placeholder="Enter State" label="State" type="text" value={supplierDetails.state} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                state: e.target.value
                            })
                        }} />
                        <InputFeilds placeholder="Enter Pincode xxxx-xxx" label="Pin Code" type="text" value={supplierDetails.pin_code} onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
                            setCustomerDetails({
                                ...supplierDetails,
                                pin_code: e.target.value
                            })
                        }} />
                        <div className="md:col-span-2 flex justify-center mt-4">
                            <SubmitButton onClick={submit} type="Customer" />
                        </div>
                    </form>
                </div>
            }
        </>
    )
}

export default SupplierForm;