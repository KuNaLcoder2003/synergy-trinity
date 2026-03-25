import type React from "react";
import { useState } from "react";
import useSuppliers from "./hooks/useSupplier";
import type { Suppliers } from "../../types";
import { DeleteIcon, Eye, Loader } from "lucide-react";
import SupplierForm from "./SupplierForm";

const SuppliersTab: React.FC = () => {
    const { suppliers, loading, error } = useSuppliers()
    const [addSupplierModal, setAddSupplierModal] = useState<boolean>(false)
    if (error) {
        alert(error)
        return
    }
    return (
        <>
            {
                loading ? <div className="w-full h-full flex items-center justify-center">
                    <Loader style={{
                        color: "oklch(69.6% 0.17 162.48)"
                    }} />
                </div> : <div className="p-6 w-full space-y-6">

                    {
                        addSupplierModal && <div className="absolute inset-0 bg-black/20 p-2 flex items-center justify-center">
                            <div className="w-7xl">
                                <SupplierForm onClose={setAddSupplierModal} />
                            </div>
                        </div>
                    }

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                            Customers
                        </h2>

                        <button
                            className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                            title="Add New"
                            onClick={() => setAddSupplierModal(true)}
                        >
                            <svg
                                className="stroke-emerald-500 fill-none group-hover:fill-emerald-800 group-active:stroke-emerald-200 group-active:fill-emerald-600 group-active:duration-0 duration-300"
                                viewBox="0 0 24 24"
                                height="50px"
                                width="50px"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-width="1.5"
                                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                ></path>
                                <path stroke-width="1.5" d="M8 12H16"></path>
                                <path stroke-width="1.5" d="M12 16V8"></path>
                            </svg>
                        </button>

                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">

                                {/* Header */}
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Mobile</th>
                                        <th className="px-6 py-3">Country</th>
                                        <th className="px-6 py-3">State</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>

                                {/* Body */}
                                <tbody>
                                    {suppliers.length > 0 ? (
                                        suppliers.map((supplier) => (
                                            <SupplierRow key={supplier._id} supplier={supplier} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-gray-400">
                                                No customers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const SupplierRow: React.FC<{ supplier: Suppliers }> = ({ supplier }) => {
    return (
        <tr className="last:border-none hover:bg-gray-50 transition">

            <td className="px-6 py-4 font-medium text-gray-800">
                {supplier._id}
            </td>

            <td className="px-6 py-4">
                {supplier.name}
            </td>

            <td className="px-6 py-4">
                {supplier.mobile}
            </td>

            <td className="px-6 py-4">
                {supplier.country}
            </td>

            <td className="px-6 py-4">
                {supplier.state}
            </td>

            <td className="px-6 py-4 flex justify-end gap-2">

                <Eye className="cursor-pointer" style={{
                    color: "oklch(69.6% 0.17 162.48)"
                }} size={16} />

                <DeleteIcon className="cursor-pointer" color="red" size={16} />

            </td>
        </tr>
    )
}

export default SuppliersTab;