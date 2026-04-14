<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'code', 'active'];

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class);
    }
}
