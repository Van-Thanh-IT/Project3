<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\ProductAttribute;
class ProductVariant extends Model
{
    use HasFactory;

    protected $table = 'product_variants';
    
    protected $fillable = [
        'product_id',
        'color',
        'size',
        'sku',
        'price'
    ];

     public $timestamps = false;

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function attributes(){
        return $this->hasMany(ProductAttribute::class, 'variant_id');
    }
}
