import React from "react";

export default function OrderDetailModal({ order, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Pedido{" "}
                            <span className="text-indigo-600">#{order.id}</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.created_at).toLocaleDateString(
                                "pt-BR",
                            )}{" "}
                            — {order.supplier?.name}
                        </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">
                        {order.status}
                    </span>
                </div>

                <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                    Produto
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                                    Qtd
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                                    Preço Unit.
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {item.product?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-600">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-mono text-gray-600">
                                        R${" "}
                                        {parseFloat(item.unit_price).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-mono font-bold text-gray-900">
                                        R${" "}
                                        {parseFloat(item.subtotal).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-indigo-50 font-black">
                                <td
                                    colSpan="3"
                                    className="px-4 py-4 text-right text-indigo-900 uppercase text-sm"
                                >
                                    Total Geral:
                                </td>
                                <td className="px-4 py-4 text-right text-indigo-900 text-lg font-mono">
                                    R${" "}
                                    {parseFloat(order.total_price).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex justify-end border-t pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
