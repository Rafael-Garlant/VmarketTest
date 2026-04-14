<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
// use App\Http\Requests\SupplierRequest;


class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = \App\Models\Supplier::all();

        // Enviando para o react
        return \Inertia\Inertia::render('Suppliers/Index', [
        'suppliers' => $suppliers
    ]);
    }

// Cria novo fornecedor
    public function store(Request $request)
    {
        // Valição com o envio de erros personalizados
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'cnpj'  => 'required|string|unique:suppliers,cnpj',
            'email' => 'required|email',
            'phone' => 'required|string',
            'active'=> 'required|boolean',
        ]);

        // Salvamento fornecedores validados
        Supplier::create($validated);

        return redirect()->route('suppliers.index')->with('success', 'Fornecedor cadastrado com sucesso!');
    }

// Atualiza fornecedor
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'cnpj'  => 'required|string|unique:suppliers,cnpj,' . $supplier->id,
            'email' => 'required|email',
            'phone' => 'required|string',
            'active'=> 'required|boolean',
        ]);

        $supplier->update($validated);

        return redirect()->route('suppliers.index')->with('success', 'Fornecedor atualizado com sucesso!');
    }

// Deleta fornecedor
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('suppliers.index')->with('success', 'Fornecedor excluído com sucesso!');

    }
}
