<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Http\Requests\PermissionRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Role;

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

            //  // Gán quyền này cho role staff mặc định
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

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
