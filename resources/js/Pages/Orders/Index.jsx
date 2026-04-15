import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import OrderForm from "./OrderForm";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
import DeleteOrderModal from "./DeleteOrderModal";

export default function Index({ auth, orders = [], flash, suppliers = [] }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deletingOrder, setDeletingOrder] = useState(null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestão de Pedidos
                </h2>
            }
        >
            <Head title="Pedidos" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* FEEDBACK DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}

                    {/* FORMULÁRIO DE NOVO PEDIDO (Carrinho de Compras) */}
                    <OrderForm suppliers={suppliers} />

                    <hr className="border-gray-300" />

                    {/* HISTÓRICO DE PEDIDOS */}
                    <OrderTable
                        orders={orders}
                        onViewDetails={setSelectedOrder}
                        onDelete={setDeletingOrder}
                    />

                    {/* MODAIS */}
                    {selectedOrder && (
                        <OrderDetailModal
                            order={selectedOrder}
                            onClose={() => setSelectedOrder(null)}
                        />
                    )}

                    {deletingOrder && (
                        <DeleteOrderModal
                            order={deletingOrder}
                            onClose={() => setDeletingOrder(null)}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
