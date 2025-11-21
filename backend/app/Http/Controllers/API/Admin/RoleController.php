<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    // Hiển thị tất cả role
    public function index()
    {
        return response()->json(Role::all());
    }

    // Thêm role mới (admin tạo)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'description' => 'nullable|string',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json(['status' => 'success', 'role' => $role]);
    }

    // Gán role cho user (admin duyệt)
    public function assignRole(Request $request, $userId)
    {
        $request->validate([
            'role_name' => 'required|string|exists:roles,name'
        ]);

        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role_name)->first();

        // Tránh gán trùng
        if ($user->roles->contains($role->id)) {
            return response()->json([
                'status' => 'error',
                'message' => "Người dùng đã có role {$role->name}"
            ], 400);
        }

        // Gán role
        $user->roles()->attach($role->id);

        return response()->json([
            'status' => 'success',
            'message' => "Gán role {$role->name} thành công cho user {$user->username}"
        ]);
    }

    // Hủy role khỏi user
    public function removeRole(Request $request, $userId)
    {
        $request->validate([
            'role_name' => 'required|string|exists:roles,name'
        ]);

        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role_name)->first();

        if (!$user->roles->contains($role->id)) {
            return response()->json([
                'status' => 'error',
                'message' => "User chưa có role {$role->name}"
            ], 400);
        }

        $user->roles()->detach($role->id);

        return response()->json([
            'status' => 'success',
            'message' => "Gỡ role {$role->name} khỏi user {$user->username} thành công"
        ]);
    }
}
