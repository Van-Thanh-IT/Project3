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
        'username', 'email', 'password', 'phone',
        'provider', 'provider_id', 'avatar',
        'status', 'gender', 'date_of_birth'
    ];

    protected $hidden = ['roles', 'permissions', 'pivot'];

    /**
     * Gửi email reset password
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function shopApplications(){
        return $this->hasMany(ShopApplication::class);
    }

    public function shop()
    {
        return $this->hasOne(Shop::class, 'seller_id');
    }


    /**
     * Quan hệ User -> UserLog
     */
    public function userLogs()
    {
        return $this->hasMany(UserLog::class);
    }

    /**
     * Quan hệ User -> Role
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    /**
     * Lấy tất cả permission thông qua roles, chỉ lấy quyền active
     */
    public function permissions()
    {
        return $this->roles()
                    ->with('permissions')
                    ->get()
                    ->pluck('permissions')
                    ->flatten()
                    ->unique('id'); 
    }

    /**
     * Kiểm tra user có role
     */
    public function hasRole(string $role): bool
    {
        return $this->roles->pluck('name')->contains($role);
    }

    /**
     * Kiểm tra user có permission
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()
                    ->pluck('name')
                    ->contains($permissionName);
    }

    /**
     * JWT
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'username'    => $this->username,
            'roles'       => $this->roles->pluck('name'),
            'permissions' => $this->permissions()->pluck('name'),
        ];
    }
}
