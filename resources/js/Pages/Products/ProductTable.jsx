// Tabela para mostrar os produtos cadastrados.
import React from "react";

export default function ProductTable({ products, onEdit, onDelete, onLink }) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700">
                    Produtos Cadastrados
                </h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {products.length} itens
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Cód.
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Nome
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition duration-150"
                            >
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                    {product.code}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {product.active ? "Ativo" : "Inativo"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => onLink(product)}
                                        className="inline-flex items-center px-3 py-1 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition shadow-sm"
                                    >
                                        Vincular Fornecedores
                                    </button>
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold text-sm ml-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(product)}
                                        className="text-red-600 hover:text-red-900 font-bold text-sm ml-2"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-12 text-center text-gray-500 italic"
                                >
                                    Nenhum produto cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
