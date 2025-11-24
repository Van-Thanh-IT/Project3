<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('product_view');
    }

    public function view(User $user, Product $product): bool
    {
        return $user->hasPermission('product_view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('product_create');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->hasPermission('product_update');
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->hasPermission('product_delete');
    }
    
    public function updateStatus(User $user, Product $product): bool
    {
        return $user->hasPermission('product_update_status');
    }
}
