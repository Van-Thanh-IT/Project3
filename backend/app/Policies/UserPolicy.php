<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class UserPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('user_view');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('user_view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('user_create');
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermission('user_update');
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasPermission('user_delete');
    }

}
