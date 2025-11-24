<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
class ProductImage extends Model
{
    use HasFactory;

    protected $table = 'product_images';

    protected $fillable = [
        'product_id',
        'variant_id',
        'is_primary',
        'url',
    ];

     public $timestamps = false;

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
