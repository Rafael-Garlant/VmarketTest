// Modal para editar o produto.
import React from "react";
import { useForm } from "@inertiajs/react";

export default function EditProductModal({ product, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        code: product.code,
        description: product.description ?? "",
        active: product.active,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(route("products.update", product.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Editar Produto:{" "}
                    <span className="text-indigo-600">{product.name}</span>
                </h3>

                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${errors.name ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Código Interno
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) => setData("code", e.target.value)}
                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${errors.code ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                        />
                        {errors.code && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border rounded-md shadow-sm px-3 py-2"
                            rows="2"
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <input
                            type="checkbox"
                            checked={data.active}
                            onChange={(e) =>
                                setData("active", e.target.checked)
                            }
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Produto Ativo no Sistema
                        </span>
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
                            disabled={processing}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md"
                        >
                            {processing ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
