import React from "react";

export default function SupplierTable({ suppliers, onEdit, onDelete }) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700">
                    Fornecedores Cadastrados
                </h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                    Total: {suppliers.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                CNPJ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                E-mail
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers.map((supplier) => (
                            <tr
                                key={supplier.id}
                                className="hover:bg-gray-50 transition duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {supplier.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 font-mono">
                                        {supplier.cnpj}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {supplier.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${supplier.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {supplier.active ? "Ativo" : "Inativo"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(supplier)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(supplier)}
                                        className="text-red-600 hover:text-red-900 font-bold"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {suppliers.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-12 text-center text-gray-500 italic"
                                >
                                    Nenhum fornecedor encontrado no banco de
                                    dados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
