import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

// --- Funções de máscara e validação ---
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

export default function SupplierForm() {
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

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
            <div className="p-6 text-gray-900">
                <h3 className="text-lg font-bold mb-6 border-b pb-2 text-indigo-600">
                    Novo Cadastro
                </h3>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Nome do Fornecedor
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm transition duration-200"
                            placeholder="Ex: Logística Brasil LTDA"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            CNPJ
                        </label>
                        <input
                            type="text"
                            value={data.cnpj}
                            onChange={handleCNPJ}
                            className={`border rounded-md shadow-sm transition duration-200 px-3 py-2 focus:outline-none focus:ring-1 ${frontErrors.cnpj ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                        />
                        {(frontErrors.cnpj || errors.cnpj) && (
                            <span className="text-red-500 text-xs mt-1">
                                {frontErrors.cnpj || errors.cnpj}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            E-mail de Contato
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Telefone / WhatsApp
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={handlePhone}
                            className={`border rounded-md shadow-sm transition duration-200 px-3 py-2 focus:outline-none focus:ring-1 ${frontErrors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                        />
                        {(frontErrors.phone || errors.phone) && (
                            <span className="text-red-500 text-xs mt-1">
                                {frontErrors.phone || errors.phone}
                            </span>
                        )}
                    </div>

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
                            Este fornecedor está ativo para novos pedidos?
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
    );
}
