<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Shop;
use App\Models\category;
use App\Models\ProductVariant;
use App\Models\ProductImage;


class Product extends Model
{
    use HasFactory;

    protected $table = "products";

    protected $fillable = [
       'shop_id',
       'category_id',
       'name',
       'slug',
       'description',
       'price',
       'status',
    ];

    public $timestamps = false;


    public function shop(){
        return $this->belongsTo(Shop::class);
    }
    
    public function Variants(){
        return $this->hasMany(ProductVariant::class);
    }

    public function images(){
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', 1);
    }

      public function category(){
        return $this->belongsTo(Category::class);
    }
}
