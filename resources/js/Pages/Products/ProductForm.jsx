// Formulário para cadastrar o produto.
import React from "react";
import { useForm } from "@inertiajs/react";

export default function ProductForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        code: "",
        description: "",
        active: true,
    });

    const submitProduct = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
            <div className="p-6">
                <h3 className="text-lg font-bold mb-6 border-b pb-2 text-indigo-600">
                    Cadastrar Novo Produto
                </h3>
                <form
                    onSubmit={submitProduct}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Nome do Produto
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${errors.name ? "border-red-500" : ""}`}
                            placeholder="Ex: Teclado Mecânico RGB"
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
                            placeholder="Ex: SKU-102030"
                            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${errors.code ? "border-red-500" : ""}`}
                        />
                        {errors.code && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="2"
                            placeholder="Breve descrição do produto..."
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <input
                            type="checkbox"
                            id="active"
                            checked={data.active}
                            onChange={(e) =>
                                setData("active", e.target.checked)
                            }
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                            htmlFor="active"
                            className="text-sm font-medium text-gray-700"
                        >
                            Produto Ativo no Sistema
                        </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg"
                        >
                            {processing ? "Processando..." : "Salvar Produto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
