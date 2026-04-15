import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import SupplierForm from "./SupplierForm";
import SupplierTable from "./SupplierTable";
import EditSupplierModal from "./EditSupplierModal";
import DeleteSupplierModal from "./DeleteSupplierModal";

export default function Index({ auth, suppliers, flash }) {
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deletingSupplier, setDeletingSupplier] = useState(null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestão de Fornecedores
                </h2>
            }
        >
            <Head title="Fornecedores" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* FLASH DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}

                    {/* FORMULÁRIO DE CADASTRO */}
                    <SupplierForm />

                    <hr className="border-gray-300" />

                    {/* TABELA DE LISTAGEM */}
                    <SupplierTable
                        suppliers={suppliers}
                        onEdit={setEditingSupplier}
                        onDelete={setDeletingSupplier}
                    />

                    {/* MODAIS */}
                    {editingSupplier && (
                        <EditSupplierModal
                            supplier={editingSupplier}
                            onClose={() => setEditingSupplier(null)}
                        />
                    )}

                    {deletingSupplier && (
                        <DeleteSupplierModal
                            supplier={deletingSupplier}
                            onClose={() => setDeletingSupplier(null)}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
