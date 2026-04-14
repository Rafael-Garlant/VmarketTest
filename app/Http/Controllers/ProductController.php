<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Jobs\LinkProductsToSuppliers;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Products/Index', [
                'products' => Product::with('suppliers')->get(),
                'suppliers' => Supplier::where('active', true)->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|unique:products,code',
            'active' => 'required|boolean',
        ]);

        Product::create($validated);

        return redirect()->back()->with('success', 'Produto cadastrado com sucesso!');
    }

    public function attachSuppliers(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'supplier_ids'  => 'required|array',
            'supplier_ids.*'=> 'exists:suppliers,id',
        ]);

        LinkProductsToSuppliers::dispatch($request->product_id, $request->supplier_ids);

        return redirect()->back()->with('success', 'Vínculos atualizados e enviados para a fila!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'code'        => 'required|string|unique:products,code,' . $product->id,
            'active'      => 'required|boolean',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Produto atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->suppliers()->detach();
        $product->delete();

        return redirect()->back()->with('success', 'Produto removido com sucesso!');
    }
}
