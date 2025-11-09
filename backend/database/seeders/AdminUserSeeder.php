<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (User::count() === 0) {
            $adminRole = Role::firstOrCreate(
                ['name' => 'admin'],
                ['description' => 'Vai trò quản trị']
            );

            $admin = User::create([
                'username' => 'Quản trị viên',
                'email' => 'admin12345@gmail.com',
                'password' => Hash::make('admin12345'),
                'phone' => '0123456789',
            ]);

            $admin->roles()->syncWithoutDetaching($adminRole->id);
            $this->command->info('Admin mặc định đã được tạo');
        }
    }
}
