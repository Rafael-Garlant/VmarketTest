<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    // Campos que o Laravel permite salvar no banco
    protected $fillable = ['name', 'cnpj', 'email', 'phone', 'active'];
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
