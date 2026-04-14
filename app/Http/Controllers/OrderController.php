<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Orders/Index', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name', 'cnpj']),
            'orders' => Order::with(['supplier', 'items.product'])
                 ->latest()
                 ->get(),
        ]);
    }


    public function getProductsBySupplier(Supplier $supplier)
    {

        $products = $supplier->products()->get(['products.id', 'products.name', 'products.code']);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id'             => ['required', 'exists:suppliers,id'],
            'items'                   => ['required', 'array', 'min:1'],
            'items.*.product_id'      => ['required', 'exists:products,id'],
            'items.*.quantity'        => ['required', 'integer', 'min:1'],
            'items.*.unit_price'      => ['required', 'numeric', 'min:0'],
        ]);

        // Calcula o total geral do pedido
        $totalPrice = collect($validated['items'])->sum(
            fn($item) => $item['quantity'] * $item['unit_price']
        );

        // Cria o pedido
        $order = Order::create([
            'supplier_id' => $validated['supplier_id'],
            'total_price' => $totalPrice,
            'status'      => 'pendente',
        ]);

        // Cria os itens do pedido
        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'subtotal'   => $item['quantity'] * $item['unit_price'],
            ]);
        }

        return redirect()
            ->route('orders.index')
            ->with('success', "Pedido #{$order->id} criado com sucesso!");
    }
    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();

        return redirect()
            ->route('orders.index')
            ->with('success', "Pedido #{$order->id} removido com sucesso!");
    }
}
