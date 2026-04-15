import React from "react";

export default function OrderTable({ orders, onViewDetails, onDelete }) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700">
                    Histórico de Pedidos Realizados
                </h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Concluídos: {orders.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Fornecedor
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Valor Total
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 text-sm font-mono text-gray-400">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {order.supplier.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                                    R${" "}
                                    {parseFloat(order.total_price).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-gray-600">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center space-x-3">
                                    <button
                                        onClick={() => onViewDetails(order)}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold text-sm"
                                    >
                                        Ver Detalhes
                                    </button>
                                    <button
                                        onClick={() => onDelete(order)}
                                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                                    >
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-500 italic"
                                >
                                    Nenhum pedido registrado no histórico.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
