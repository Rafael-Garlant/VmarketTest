<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redireciona a página inicial direto para os fornecedores
Route::get('/', function () {
    return redirect()->route('suppliers.index');
});

// Rota do Dashboard (Pode manter por enquanto para não quebrar o layout)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// A rota que você realmente quer usar
Route::middleware('auth')->group(function () {
    Route::resource('suppliers', SupplierController::class);

    // Rotas de perfil (Breeze usa isso, melhor não apagar)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/products/attach', [ProductController::class, 'attachSuppliers'])->name('products.attach');
    Route::resource('/products', ProductController::class);
    Route::resource('orders', OrderController::class);
    Route::get('/api/suppliers/{supplier}/products', [OrderController::class, 'getProductsBySupplier'])->name('api.products-by-supplier');
});

require __DIR__.'/auth.php';
