import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Index({ auth, orders = [], flash, suppliers = [] }) {
    const [cart, setCart] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        product_id: "",
        product_name: "",
        quantity: 1,
        unit_price: "",
    });

    const { data, setData, post, processing, reset, errors } = useForm({
        supplier_id: "",
        items: [],
    });

    useEffect(() => {
        if (!data.supplier_id) {
            setAvailableProducts([]);
            setCart([]);
            setCurrentItem({
                product_id: "",
                product_name: "",
                quantity: 1,
                unit_price: "",
            });
            return;
        }

        setLoadingProducts(true);
        axios
            .get(`/api/suppliers/${data.supplier_id}/products`)
            .then((res) => setAvailableProducts(res.data))
            .catch(() => setAvailableProducts([]))
            .finally(() => setLoadingProducts(false));
    }, [data.supplier_id]);

    const totalOrder = cart.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.unit_price || 0),
        0,
    );

    const addItem = () => {
        if (!currentItem.product_id) {
            alert("Selecione um produto.");
            return;
        }
        if (!currentItem.quantity || currentItem.quantity <= 0) {
            alert("Informe uma quantidade válida.");
            return;
        }
        if (
            !currentItem.unit_price ||
            parseFloat(currentItem.unit_price) <= 0
        ) {
            alert("Informe um preço unitário válido.");
            return;
        }

        const existing = cart.findIndex(
            (i) => i.product_id === currentItem.product_id,
        );
        let newCart;
        if (existing >= 0) {
            newCart = cart.map((item, idx) =>
                idx === existing
                    ? {
                          ...item,
                          quantity:
                              Number(item.quantity) +
                              Number(currentItem.quantity),
                      }
                    : item,
            );
        } else {
            newCart = [
                ...cart,
                { ...currentItem, quantity: Number(currentItem.quantity) },
            ];
        }

        setCart(newCart);
        setCurrentItem({
            product_id: "",
            product_name: "",
            quantity: 1,
            unit_price: "",
        });
    };

    const removeItem = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const { delete: deleteOrder, processing: deleteProcessing } = useForm();

    const openDeleteModal = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteOrder(route("orders.destroy", orderToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setOrderToDelete(null);
            },
        });
    };

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.supplier_id) {
            alert("Selecione um fornecedor.");
            return;
        }
        if (cart.length === 0) {
            alert("Adicione ao menos um item ao carrinho.");
            return;
        }

        setData("items", cart);
    };
    useEffect(() => {
        if (data.items.length > 0) {
            post(route("orders.store"), {
                onSuccess: () => {
                    reset();
                    setCart([]);
                    setAvailableProducts([]);
                    setCurrentItem({
                        product_id: "",
                        product_name: "",
                        quantity: 1,
                        unit_price: "",
                    });
                },
            });
        }
    }, [data.items]);
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
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Confirmar Remoção
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Tem certeza que deseja remover o{" "}
                                <span className="font-bold text-red-600">
                                    Pedido #{orderToDelete?.id}
                                </span>
                                ? Essa ação não pode ser desfeita.
                            </p>
                            <div className="flex justify-end space-x-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={deleteProcessing}
                                    className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-red-700 disabled:opacity-50 shadow-md"
                                >
                                    {deleteProcessing
                                        ? "Removendo..."
                                        : "Sim, Remover"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isDetailModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4 border-b pb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Pedido{" "}
                                        <span className="text-indigo-600">
                                            #{selectedOrder?.id}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                            selectedOrder?.created_at,
                                        ).toLocaleDateString("pt-BR")}{" "}
                                        — {selectedOrder?.supplier?.name}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">
                                    {selectedOrder?.status}
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
                                        {selectedOrder?.items?.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {item.product?.name ?? "—"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center text-gray-600">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-mono text-gray-600">
                                                    R${" "}
                                                    {parseFloat(
                                                        item.unit_price,
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-mono font-bold text-gray-900">
                                                    R${" "}
                                                    {parseFloat(
                                                        item.subtotal,
                                                    ).toFixed(2)}
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
                                                {parseFloat(
                                                    selectedOrder?.total_price,
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="flex justify-end border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* 1. FEEDBACK DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}

                    {/* 2. CARD DO FORMULÁRIO DE NOVO PEDIDO */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-6 border-b pb-2 text-indigo-600">
                                Novo Pedido de Compra
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Seleção do Fornecedor */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Selecione o Fornecedor
                                    </label>
                                    <select
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm transition"
                                        value={data.supplier_id}
                                        onChange={(e) =>
                                            setData(
                                                "supplier_id",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Escolha um fornecedor para
                                            começar...
                                        </option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.cnpj})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.supplier_id}
                                        </p>
                                    )}
                                </div>

                                {/* ÁREA DE ADICIONAR PRODUTOS (Só aparece se houver fornecedor) */}
                                {data.supplier_id && (
                                    <div className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-200">
                                        <h4 className="text-xs font-black mb-4 uppercase text-gray-400 tracking-widest">
                                            Adicionar Itens ao Carrinho
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                                    Produto Vinculado
                                                </label>
                                                <select
                                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                                    value={
                                                        currentItem.product_id
                                                    }
                                                    onChange={(e) => {
                                                        const p =
                                                            availableProducts.find(
                                                                (x) =>
                                                                    x.id ==
                                                                    e.target
                                                                        .value,
                                                            );
                                                        setCurrentItem({
                                                            ...currentItem,
                                                            product_id:
                                                                e.target.value,
                                                            product_name:
                                                                p?.name,
                                                        });
                                                    }}
                                                >
                                                    <option value="">
                                                        Selecione...
                                                    </option>
                                                    {availableProducts.map(
                                                        (p) => (
                                                            <option
                                                                key={p.id}
                                                                value={p.id}
                                                            >
                                                                {p.name} -{" "}
                                                                {p.code}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                                    Quantidade
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                                    value={currentItem.quantity}
                                                    onChange={(e) =>
                                                        setCurrentItem({
                                                            ...currentItem,
                                                            quantity:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                                    Preço Unit.
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                                    value={
                                                        currentItem.unit_price
                                                    }
                                                    onChange={(e) =>
                                                        setCurrentItem({
                                                            ...currentItem,
                                                            unit_price:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 transition shadow-md h-[38px]"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* TABELA DO CARRINHO */}
                                {cart.length > 0 && (
                                    <div className="mt-8 border rounded-lg overflow-hidden">
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
                                                        Subtotal
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                        Ações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {cart.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {item.product_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-mono">
                                                            R${" "}
                                                            {(
                                                                item.quantity *
                                                                item.unit_price
                                                            ).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                            >
                                                                {" "}
                                                                Remover{" "}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-indigo-50 font-black">
                                                    <td
                                                        colSpan="2"
                                                        className="px-4 py-4 text-right text-indigo-900 uppercase"
                                                    >
                                                        Total Geral:
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-indigo-900 text-lg">
                                                        R${" "}
                                                        {totalOrder.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="p-4 bg-white border-t">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-black text-lg hover:bg-indigo-700 shadow-xl transition transform active:scale-95 disabled:opacity-50"
                                            >
                                                {processing
                                                    ? "PROCESSANDO..."
                                                    : "FINALIZAR PEDIDO"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* 3. CARD DO HISTÓRICO DE PEDIDOS */}
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
                                                {parseFloat(
                                                    order.total_price,
                                                ).toFixed(2)}
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
                                                    onClick={() =>
                                                        openDetailModal(order)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold text-sm"
                                                >
                                                    Ver Detalhes
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(order)
                                                    }
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
                                                Nenhum pedido registrado no
                                                histórico.
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
