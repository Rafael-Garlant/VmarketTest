// Modal para vincular o produto com fornecedor.
import React from "react";
import { useForm } from "@inertiajs/react";

export default function LinkSuppliersModal({ product, suppliers, onClose }) {
    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        supplier_ids: product.suppliers
            ? product.suppliers.map((s) => s.id)
            : [],
    });

    const handleCheckboxChange = (supplierId) => {
        const currentIds = [...data.supplier_ids];
        if (currentIds.includes(supplierId)) {
            setData(
                "supplier_ids",
                currentIds.filter((id) => id !== supplierId),
            );
        } else {
            setData("supplier_ids", [...currentIds, supplierId]);
        }
    };

    const submitLink = (e) => {
        e.preventDefault();
        post(route("products.attach"), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Vincular Fornecedores a:{" "}
                    <span className="text-indigo-600">{product.name}</span>
                </h3>

                <form onSubmit={submitLink}>
                    <div className="max-h-60 overflow-y-auto mb-6 border border-gray-100 rounded-lg p-3 bg-gray-50">
                        {suppliers.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="flex items-center mb-3 last:mb-0 p-2 hover:bg-white rounded transition"
                            >
                                <input
                                    type="checkbox"
                                    id={`supplier-${supplier.id}`}
                                    checked={data.supplier_ids.includes(
                                        supplier.id,
                                    )}
                                    onChange={() =>
                                        handleCheckboxChange(supplier.id)
                                    }
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                                />
                                <label
                                    htmlFor={`supplier-${supplier.id}`}
                                    className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                                >
                                    <span className="font-semibold">
                                        {supplier.name}
                                    </span>
                                    <span className="text-gray-400 block text-xs">
                                        {supplier.cnpj}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={
                                processing || data.supplier_ids.length === 0
                            }
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {processing
                                ? "Enviando para Fila..."
                                : "Confirmar Vínculos"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
