import React from "react";
import { useForm } from "@inertiajs/react";

export default function DeleteOrderModal({ order, onClose }) {
    const { delete: destroy, processing } = useForm();

    const confirmDelete = () => {
        destroy(route("orders.destroy", order.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Confirmar Remoção
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Tem certeza que deseja remover o{" "}
                    <span className="font-bold text-red-600">
                        Pedido #{order.id}
                    </span>
                    ? Essa ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        disabled={processing}
                        className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-red-700 disabled:opacity-50 shadow-md"
                    >
                        {processing ? "Removendo..." : "Sim, Remover"}
                    </button>
                </div>
            </div>
        </div>
    );
}
