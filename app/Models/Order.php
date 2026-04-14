<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['supplier_id', 'total_price', 'status'];

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}
