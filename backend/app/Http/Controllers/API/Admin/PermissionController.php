<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Http\Requests\PermissionRequest;
use App\Http\Requests\AssignPermissionRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\User;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permission = Permission::all();
        return response()->json($permission);
    }

    /**
     * Show the form for creating a new resource.
     */
   public function store(PermissionRequest $request)
    {
        try {
            // Bắt đầu transaction
            $permission = DB::transaction(function () use ($request) {
                // Tạo quyền mới
                return Permission::create([
                    'name' => $request->name,
                    'description' => $request->description,
                ]);
            });

            // Lấy tất cả role "admin"
            $adminRoles = Role::where('name', 'admin')->get();
            // Gán quyền mới cho tất cả admin
            foreach ($adminRoles as $role) {
                if (!$role->permissions->contains($permission->id)) {
                    $role->permissions()->attach($permission->id);
                }
            }

             // Gán quyền này cho role staff mặc định
            // $staffRole = Role::where('name', 'staff')->first();
            // if ($staffRole) {
            //     $staffRole->permissions()->syncWithoutDetaching($permission->id);
            // }

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

    public function assignPermissionToStaff(AssignPermissionRequest $request, $permissionId){
        try {
            // Lấy quyền
            $permission = Permission::findOrFail($permissionId);

            // Lấy role "staff"
            $staffRole = Role::where('name', 'staff')->first();

            if (!$staffRole) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role "staff" không tồn tại trong hệ thống!',
                ], 404);
            }

            // Lấy danh sách ID nhân viên gửi lên
            $staffIds = $request->input('staff_ids', []);
            // Lấy danh sách user có role staff
            $staffUsers = User::whereIn('id', $staffIds)
                ->whereHas('roles', fn($q) => $q->where('name', 'staff'))
                ->get();

            // Nếu có user không phải staff → báo lỗi
            $invalidUsers = collect($staffIds)->diff($staffUsers->pluck('id'));
            if ($invalidUsers->isNotEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Các ID sau không phải nhân viên (staff): ' . 'ID: '.$invalidUsers->join(' , '),
                ], 403);
            }

            // Gán quyền cho role staff nếu chưa có
            if (!$staffRole->permissions->contains($permission->id)) {
                $staffRole->permissions()->attach($permission->id);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Gán quyền "' . $permission->name . '" thành công cho các nhân viên!',
                'assigned_staff' => $staffUsers->pluck('id'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống: ' . $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $permission = Permission::find($id);
            if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quyền không tồn tại',
            ], 404);
        }
        $permission->is_active = !$permission->is_active;
        $permission->save();
        return response()->json([
            'status' => 'success',
            'message' => $permission->is_active ? 'Quyền đã được khôi phục thành công!':'Quyền đã được xóa thành công!',
        ]);
    }
}
