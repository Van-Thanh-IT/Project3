<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Http\Requests\PermissionRequest;
use App\Http\Requests\AssignPermissionRequest;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{

    public function getPermissionsWithStaffStatus()
    {
        $staffRole = Role::where('name', 'staff')->firstOrFail();

        $allPermissions = Permission::all();
        $staffPermissionIds = $staffRole->permissions()->pluck('permissions.id')->toArray();

        return response()->json([
            'permissions' => $allPermissions,
            'staff_permission_ids' => $staffPermissionIds
        ]);
    }

    // Tạo quyền mới và gán cho role admin
    public function createPermission(PermissionRequest $request)
    {
        try {
            $permission = DB::transaction(function () use ($request) {
                return Permission::create($request->only('name', 'description'));
            });

            // Gán quyền mới cho tất cả admin nếu chưa có
            Role::where('name', 'admin')->get()->each(function($role) use ($permission) {
                $role->permissions()->syncWithoutDetaching($permission->id);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo quyền thành công và gán cho admin!',
                'data' => $permission
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo quyền: ' . $e->getMessage()
            ], 500);
        }
    }

    public function assignPermissionToStaff(Request $request)
    {
        try {
            $permissionIds = $request->input('permission_ids', []); // quyền muốn thêm
            $removeIds = $request->input('remove_permission_ids', []); // quyền muốn xóa

            $staffRole = Role::where('name', 'staff')->firstOrFail();

            if (!empty($permissionIds)) {
                $staffRole->permissions()->syncWithoutDetaching($permissionIds);
            }

            if (!empty($removeIds)) {
                $staffRole->permissions()->detach($removeIds);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật quyền thành công!',
                'role' => $staffRole->name,
                'added_permission_ids' => $permissionIds,
                'removed_permission_ids' => $removeIds
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }

}
