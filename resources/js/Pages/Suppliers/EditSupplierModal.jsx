import React from "react";
import { useForm } from "@inertiajs/react";

// --- Funções de máscara ---
const maskCNPJ = (value) => {
    return value
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};

const maskPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};

export default function EditSupplierModal({ supplier, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        cnpj: supplier.cnpj,
        email: supplier.email,
        phone: supplier.phone,
        active: supplier.active,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(route("suppliers.update", supplier.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Editar Fornecedor:{" "}
                    <span className="text-indigo-600">{supplier.name}</span>
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
                            CNPJ
                        </label>
                        <input
                            type="text"
                            value={data.cnpj}
                            onChange={(e) =>
                                setData("cnpj", maskCNPJ(e.target.value))
                            }
                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${errors.cnpj ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                            maxLength={18}
                        />
                        {errors.cnpj && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.cnpj}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) =>
                                setData("phone", maskPhone(e.target.value))
                            }
                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${errors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                            maxLength={15}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        )}
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
                            Fornecedor ativo para novos pedidos?
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
