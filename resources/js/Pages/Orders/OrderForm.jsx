import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function OrderForm({ suppliers }) {
    const [cart, setCart] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        product_id: "",
        product_name: "",
        quantity: 1,
        unit_price: "",
    });

    // 1. Adicionamos 'observations' ao estado inicial do formulário
    const { data, setData, post, processing, reset, errors } = useForm({
        supplier_id: "",
        observations: "",
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
        if (
            !currentItem.product_id ||
            currentItem.quantity <= 0 ||
            !currentItem.unit_price
        ) {
            alert("Preencha todos os campos do item corretamente.");
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

        // Sincronizamos o carrinho com o objeto de envio e disparamos o POST
        // Nota: O uso do useEffect aqui é para garantir que o post ocorra após o setData
        setData("items", cart);
    };

    useEffect(() => {
        if (data.items.length > 0) {
            post(route("orders.store"), {
                onSuccess: () => {
                    reset(); // Limpa supplier_id, observations e items
                    setCart([]);
                    setAvailableProducts([]);
                },
            });
        }
    }, [data.items]);

    return (
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
                                setData("supplier_id", e.target.value)
                            }
                        >
                            <option value="">Escolha um fornecedor...</option>
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

                    {/* Carrinho de Itens */}
                    {data.supplier_id && (
                        <div className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-200">
                            <h4 className="text-xs font-black mb-4 uppercase text-gray-400 tracking-widest">
                                Adicionar Itens
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-600 mb-1">
                                        Produto
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                        value={currentItem.product_id}
                                        onChange={(e) => {
                                            const p = availableProducts.find(
                                                (x) => x.id == e.target.value,
                                            );
                                            setCurrentItem({
                                                ...currentItem,
                                                product_id: e.target.value,
                                                product_name: p?.name,
                                            });
                                        }}
                                    >
                                        <option value="">Selecione...</option>
                                        {availableProducts.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-gray-600 mb-1">
                                        Qtd
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                                        value={currentItem.quantity}
                                        onChange={(e) =>
                                            setCurrentItem({
                                                ...currentItem,
                                                quantity: e.target.value,
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
                                        value={currentItem.unit_price}
                                        onChange={(e) =>
                                            setCurrentItem({
                                                ...currentItem,
                                                unit_price: e.target.value,
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

                    {/* Resumo e Observações */}
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
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
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
                                            <td className="px-4 py-3 text-sm text-gray-900">
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
                                                        removeItem(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 font-bold"
                                                >
                                                    Remover
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* 2. Novo campo de Observações na interface */}
                            <div className="p-6 bg-gray-50 border-t">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Observações do Pedido (Opcional)
                                </label>
                                <textarea
                                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm transition"
                                    rows="3"
                                    placeholder="Ex: Entrega apenas no período da tarde, embalagem reforçada..."
                                    value={data.observations}
                                    onChange={(e) =>
                                        setData("observations", e.target.value)
                                    }
                                />
                                {errors.observations && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.observations}
                                    </p>
                                )}
                            </div>

                            <div className="p-4 bg-white border-t border-b flex justify-end items-center bg-indigo-50">
                                <span className="text-indigo-900 font-black text-xl mr-4 uppercase text-sm">
                                    Total Geral:
                                </span>
                                <span className="text-indigo-900 font-black text-2xl">
                                    R$ {totalOrder.toFixed(2)}
                                </span>
                            </div>

                            <div className="p-4 bg-white">
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
    );
}
