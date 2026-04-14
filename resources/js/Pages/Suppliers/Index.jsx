import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

// --- Funções de máscara ---
const maskCNPJ = (value) => {
    return value
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};

const maskPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};

// --- Funções de validação ---
const validateCNPJ = (cnpj) => {
    const digits = cnpj.replace(/\D/g, "");
    if (digits.length !== 14) return false;
    if (/^(\d)\1+$/.test(digits)) return false;

    const calc = (digits, length) => {
        let sum = 0;
        let pos = length - 7;
        for (let i = length; i >= 1; i--) {
            sum += parseInt(digits.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result === parseInt(digits.charAt(length));
    };

    return calc(digits, 12) && calc(digits, 13);
};

const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
};

export default function Index({ auth, suppliers, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        cnpj: "",
        email: "",
        phone: "",
        active: true,
    });

    const [frontErrors, setFrontErrors] = useState({});

    const handleCNPJ = (e) => {
        const masked = maskCNPJ(e.target.value);
        setData("cnpj", masked);

        if (masked.replace(/\D/g, "").length === 14) {
            setFrontErrors((prev) => ({
                ...prev,
                cnpj: validateCNPJ(masked) ? "" : "CNPJ inválido.",
            }));
        } else {
            setFrontErrors((prev) => ({ ...prev, cnpj: "" }));
        }
    };

    const handlePhone = (e) => {
        const masked = maskPhone(e.target.value);
        setData("phone", masked);

        const digits = masked.replace(/\D/g, "");
        if (digits.length >= 10) {
            setFrontErrors((prev) => ({
                ...prev,
                phone: validatePhone(masked) ? "" : "Telefone inválido.",
            }));
        } else {
            setFrontErrors((prev) => ({ ...prev, phone: "" }));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (data.cnpj && !validateCNPJ(data.cnpj))
            newErrors.cnpj = "CNPJ inválido.";
        if (data.phone && !validatePhone(data.phone))
            newErrors.phone = "Telefone inválido.";

        if (Object.keys(newErrors).length > 0) {
            setFrontErrors(newErrors);
            return;
        }

        post(route("suppliers.store"), {
            onSuccess: () => reset(),
        });
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const {
        data: editData,
        setData: setEditData,
        put: putSupplier,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: "",
        cnpj: "",
        email: "",
        phone: "",
        active: true,
    });

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setEditData({
            name: supplier.name,
            cnpj: supplier.cnpj,
            email: supplier.email,
            phone: supplier.phone,
            active: supplier.active,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        putSupplier(route("suppliers.update", editingSupplier.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetEdit();
            },
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const { delete: deleteSupplier, processing: deleteProcessing } = useForm();

    const openDeleteModal = (supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteSupplier(route("suppliers.destroy", supplierToDelete.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSupplierToDelete(null);
            },
        });
    };

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
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">
                                Editar Fornecedor:{" "}
                                <span className="text-indigo-600">
                                    {editingSupplier?.name}
                                </span>
                            </h3>

                            <form onSubmit={submitEdit} className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData("name", e.target.value)
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
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.cnpj}
                                        onChange={(e) =>
                                            setEditData(
                                                "cnpj",
                                                maskCNPJ(e.target.value),
                                            )
                                        }
                                        className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${editErrors.cnpj ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                                        maxLength={18}
                                    />
                                    {editErrors.cnpj && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {editErrors.cnpj}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                            setEditData("email", e.target.value)
                                        }
                                        className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${editErrors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                                    />
                                    {editErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {editErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.phone}
                                        onChange={(e) =>
                                            setEditData(
                                                "phone",
                                                maskPhone(e.target.value),
                                            )
                                        }
                                        className={`border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 ${editErrors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                                        maxLength={15}
                                    />
                                    {editErrors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {editErrors.phone}
                                        </p>
                                    )}
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
                                        Fornecedor ativo para novos pedidos?
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
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Confirmar Exclusão
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Tem certeza que deseja excluir o fornecedor{" "}
                                <span className="font-bold text-red-600">
                                    {supplierToDelete?.name}
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
                                        ? "Excluindo..."
                                        : "Sim, Excluir"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* FLASH DE SUCESSO */}
                    {flash?.success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow-sm">
                            <p className="font-bold">Sucesso!</p>
                            <p className="text-sm">{flash.success}</p>
                        </div>
                    )}

                    {/* CARD DO FORMULÁRIO */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-6 border-b pb-2 text-indigo-600">
                                Novo Cadastro
                            </h3>

                            <form
                                onSubmit={submit}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Nome */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Nome do Fornecedor
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm transition duration-200"
                                        placeholder="Ex: Logística Brasil LTDA"
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                {/* CNPJ */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cnpj}
                                        onChange={handleCNPJ}
                                        className={`border rounded-md shadow-sm transition duration-200 px-3 py-2 focus:outline-none focus:ring-1 ${
                                            frontErrors.cnpj
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        }`}
                                        placeholder="00.000.000/0000-00"
                                        maxLength={18}
                                    />
                                    {(frontErrors.cnpj || errors.cnpj) && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {frontErrors.cnpj || errors.cnpj}
                                        </span>
                                    )}
                                </div>

                                {/* E-mail */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        E-mail de Contato
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                {/* Telefone */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Telefone / WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={handlePhone}
                                        className={`border rounded-md shadow-sm transition duration-200 px-3 py-2 focus:outline-none focus:ring-1 ${
                                            frontErrors.phone
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                                                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        }`}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                    />
                                    {(frontErrors.phone || errors.phone) && (
                                        <span className="text-red-500 text-xs mt-1">
                                            {frontErrors.phone || errors.phone}
                                        </span>
                                    )}
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center space-x-3 md:col-span-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={data.active}
                                        onChange={(e) =>
                                            setData("active", e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Este fornecedor está ativo para novos
                                        pedidos?
                                    </span>
                                </div>

                                <div className="md:col-span-2 flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing
                                            ? "Salvando..."
                                            : "Cadastrar Fornecedor"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* TABELA DE LISTAGEM */}
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
                                                    {supplier.active
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(supplier)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            supplier,
                                                        )
                                                    }
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
                                                Nenhum fornecedor encontrado no
                                                banco de dados.
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
