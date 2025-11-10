<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = "users";

    protected $fillable = [
        'username',
        'email',
        'password',
        'phone',
        'provider',
        'provider_id',
        'avatar',
        'status',
        'gender',
        'date_of_birth'
    ];
    // Đây là một class Notification
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    // Quan hệ User -> Roles
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    // Lấy tất cả permissions thông qua roles
    public function permissions()
    {
        $this->loadMissing('roles.permissions'); // load roles kèm permissions

        // Lấy permissions active
        return $this->roles
                    ->pluck('permissions') // collection of collection
                    ->flatten()            // gộp thành 1 collection
                    ->where('is_active', 1) // chỉ lấy quyền active
                    ->unique('id');         // loại bỏ trùng lặp
    }


    // Kiểm tra user có role
    public function hasRole($role)
    {
        return $this->roles->pluck('name')->contains($role);
    }

    // Kiểm tra user có permission
    public function hasPermission($permissionName)
    {
        // Lấy tất cả permission của user mà is_active = true
        $permissions = $this->permissions()
                            ->where('is_active', true)   // chỉ lấy quyền đang hoạt động
                            ->pluck('name')
                            ->toArray();

        return in_array($permissionName, $permissions);
    }

    // JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'username'    => $this->username,
            'roles'       => $this->roles->pluck('name'),
            'permissions' => $this->permissions()->pluck('name')
        ];
    }
}
