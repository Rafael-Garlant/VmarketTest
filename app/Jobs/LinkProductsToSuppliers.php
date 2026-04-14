<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LinkProductsToSuppliers implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productId;
    protected $supplierIds;

    /**
     * O Job recebe o ID do produto e a lista de fornecedores.
     */
    public function __construct($productId, array $supplierIds)
    {
        $this->productId = $productId;
        $this->supplierIds = $supplierIds;
    }

    /**
     * Aqui é onde o trabalho pesado acontece.
     */
    public function handle(): void
    {
        $product = Product::find($this->productId);

        if ($product) {
            // O syncWithoutDetaching adiciona os novos vínculos sem apagar os que já existem
            $product->suppliers()->sync($this->supplierIds);
        }
    }
}
