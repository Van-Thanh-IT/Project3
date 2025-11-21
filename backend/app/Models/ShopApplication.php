<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopApplication extends Model
{
    use HasFactory;

    protected $table = 'shop_applications';

     protected $fillable = [
        'user_id',
        'vat_number',
        'business_doc',
        'address',
        'phone',
        'reason',
        'status',
    ];

    /**
     * Quan hệ: mỗi shop_applications thuộc về 1 user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
