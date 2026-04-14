import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Index({ auth, products, suppliers, flash }) {
    // 1. Estados para o Modal de Vínculo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const {
        data: editData,
        setData: setEditData,
        put: putProduct,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: "",
        code: "",
        description: "",
        active: true,
    });

    // useForm de cadastro
    const {
        data: productData,
        setData: setProductData,
        post: postProduct,
        processing: productProcessing,
        errors: productErrors,
        reset: resetProduct,
    } = useForm({
        name: "",
        code: "",
        description: "",
        active: true,
    });

    // useForm de vínculo
    const {
        data: linkData,
        setData: setLinkData,
        post: postLink,
        processing: linkProcessing,
    } = useForm({
        product_id: "",
        supplier_ids: [],
    });

    const openEditModal = (product) => {
        setEditingProduct(product);
        setEditData({
            name: product.name,
            code: product.code,
            description: product.description ?? "",
            active: product.active,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        putProduct(route("products.update", editingProduct.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetEdit();
            },
        });
    };

    // --- Lógica de Cadastro de Produto ---
    const submitProduct = (e) => {
        e.preventDefault();
        postProduct(route("products.store"), {
            onSuccess: () => resetProduct(),
        });
    };

    // --- Lógica do Modal de Vínculo ---
    const openLinkModal = (product) => {
        setSelectedProduct(product);
        setLinkData({
            product_id: product.id,
            supplier_ids: product.suppliers
                ? product.suppliers.map((s) => s.id)
                : [],
        });
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (supplierId) => {
        const currentIds = [...linkData.supplier_ids];
        if (currentIds.includes(supplierId)) {
            setLinkData(
                "supplier_ids",
                currentIds.filter((id) => id !== supplierId),
            );
        } else {
            setLinkData("supplier_ids", [...currentIds, supplierId]);
        }
    };

    const submitLink = (e) => {
        e.preventDefault();
        postLink(route("products.attach"), {
            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };
    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
        useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const { delete: deleteProduct, processing: deleteProductProcessing } =
        useForm();

    const openDeleteProductModal = (product) => {
        setProductToDelete(product);
        setIsDeleteProductModalOpen(true);
    };

    const confirmDeleteProduct = () => {
        deleteProduct(route("products.destroy", productToDelete.id), {
            onSuccess: () => {
                setIsDeleteProductModalOpen(false);
                setProductToDelete(null);
            },
        });
    };
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
                    {/* MODAL DE VÍNCULO */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">
                                    Editar Produto:{" "}
                                    <span className="text-indigo-600">
                                        {editingProduct?.name}
                                    </span>
                                </h3>

                                <form
                                    onSubmit={submitEdit}
                                    className="space-y-4"
                                >
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-1">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) =>
                                                setEditData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${editErrors.name ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                                        />
                                        {editErrors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {editErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-1">
                                            Código Interno
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.code}
                                            onChange={(e) =>
                                                setEditData(
                                                    "code",
                                                    e.target.value,
                                                )
                                            }
                                            className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${editErrors.code ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                                        />
                                        {editErrors.code && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {editErrors.code}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) =>
                                                setEditData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border rounded-md shadow-sm px-3 py-2"
                                            rows="2"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={editData.active}
                                            onChange={(e) =>
                                                setEditData(
                                                    "active",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Produto Ativo no Sistema
                                        </span>
                                    </div>

                                    <div className="flex justify-end space-x-3 border-t pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsEditModalOpen(false)
                                            }
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editProcessing}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md"
                                        >
                                            {editProcessing
                                                ? "Salvando..."
                                                : "Salvar Alterações"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {isDeleteProductModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    Confirmar Exclusão
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Tem certeza que deseja excluir o produto{" "}
                                    <span className="font-bold text-red-600">
                                        {productToDelete?.name}
                                    </span>
                                    ? Essa ação não pode ser desfeita.
                                </p>
                                <div className="flex justify-end space-x-3 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDeleteProductModalOpen(false)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDeleteProduct}
                                        disabled={deleteProductProcessing}
                                        className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-red-700 disabled:opacity-50 shadow-md"
                                    >
                                        {deleteProductProcessing
                                            ? "Excluindo..."
                                            : "Sim, Excluir"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FEEDBACK DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">
                                    Vincular Fornecedores a:{" "}
                                    <span className="text-indigo-600">
                                        {selectedProduct?.name}
                                    </span>
                                </h3>

                                <form onSubmit={submitLink}>
                                    <div className="max-h-60 overflow-y-auto mb-6 border border-gray-100 rounded-lg p-3 bg-gray-50">
                                        {suppliers.map((supplier) => (
                                            <div
                                                key={supplier.id}
                                                className="flex items-center mb-3 last:mb-0 p-2 hover:bg-white rounded transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`supplier-${supplier.id}`}
                                                    checked={linkData.supplier_ids.includes(
                                                        supplier.id,
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            supplier.id,
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                                                />
                                                <label
                                                    htmlFor={`supplier-${supplier.id}`}
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                                                >
                                                    <span className="font-semibold">
                                                        {supplier.name}
                                                    </span>
                                                    <span className="text-gray-400 block text-xs">
                                                        {supplier.cnpj}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end space-x-3 border-t pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                linkProcessing ||
                                                linkData.supplier_ids.length ===
                                                    0
                                            }
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                        >
                                            {linkProcessing
                                                ? "Enviando para Fila..."
                                                : "Confirmar Vínculos"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* CARD DO FORMULÁRIO DE CADASTRO */}
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
                                        value={productData.name}
                                        onChange={(e) =>
                                            setProductData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${productErrors.name ? "border-red-500" : ""}`}
                                        placeholder="Ex: Teclado Mecânico RGB"
                                    />
                                    {productErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {productErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Código Interno
                                    </label>
                                    <input
                                        type="text"
                                        value={productData.code}
                                        onChange={(e) =>
                                            setProductData(
                                                "code",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: SKU-102030"
                                        className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${productErrors.code ? "border-red-500" : ""}`}
                                    />
                                    {productErrors.code && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {productErrors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2 flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={productData.description}
                                        onChange={(e) =>
                                            setProductData(
                                                "description",
                                                e.target.value,
                                            )
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
                                        checked={productData.active}
                                        onChange={(e) =>
                                            setProductData(
                                                "active",
                                                e.target.checked,
                                            )
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
                                        disabled={productProcessing}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg"
                                    >
                                        {productProcessing
                                            ? "Processando..."
                                            : "Salvar Produto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* CARD DA TABELA DE LISTAGEM */}
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
                                                    {product.active
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() =>
                                                        openLinkModal(product)
                                                    }
                                                    className="inline-flex items-center px-3 py-1 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition shadow-sm"
                                                >
                                                    Vincular Fornecedores
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(product)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold text-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteProductModal(
                                                            product,
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900 font-bold text-sm"
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
