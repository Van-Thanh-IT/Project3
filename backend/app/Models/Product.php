<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = "products";

    protected $fillable = [
        
    ];

    public function shop(){
        return $this->belongsTo(Shop::class);
    }

    public function Variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
  
      public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

      public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
