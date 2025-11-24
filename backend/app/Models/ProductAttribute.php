<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant;

class ProductAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'variant_id',
        'attribute_name',
        'attribute_value',
    ];

     public $timestamps = false;

   public function variant(){
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
