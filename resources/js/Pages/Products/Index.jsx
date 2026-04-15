import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import LinkSuppliersModal from "./LinkSuppliersModal";

export default function Index({ auth, products, suppliers, flash }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [linkingProduct, setLinkingProduct] = useState(null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestão de Produtos
                </h2>
            }
        >
            <Head title="Produtos" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* FEEDBACK DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}

                    {/* FORMULÁRIO DE CADASTRO */}
                    <ProductForm />

                    <hr className="border-gray-300" />

                    {/* TABELA DE LISTAGEM */}
                    <ProductTable
                        products={products}
                        onEdit={setEditingProduct}
                        onDelete={setDeletingProduct}
                        onLink={setLinkingProduct}
                    />

                    {/* MODAIS (Renderizados condicionalmente para resetar o estado interno) */}
                    {editingProduct && (
                        <EditProductModal
                            product={editingProduct}
                            onClose={() => setEditingProduct(null)}
                        />
                    )}

                    {deletingProduct && (
                        <DeleteProductModal
                            product={deletingProduct}
                            onClose={() => setDeletingProduct(null)}
                        />
                    )}

                    {linkingProduct && (
                        <LinkSuppliersModal
                            product={linkingProduct}
                            suppliers={suppliers}
                            onClose={() => setLinkingProduct(null)}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
