<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
class StaffController extends Controller
{
    public function getAllStaffs(){
        $this->authorize('viewAny', User::class);

        $users = User::with('roles')
            ->whereHas('roles', function($q) {
                $q->where('name', 'staff');
            })
            ->paginate(20);

        return response()->json($users);
    }

     public function getStaffById($id)
    {
         $staff = User::findOrFail($id);
        $this->authorize('view', $staff);

        return response()->json($staff);
    }


  /**
     * Cập nhật thông tin nhân viên
     */
    public function updateStaff(Request $request, $id)
    {
        $staff = User::findOrFail($id);
        $this->authorize('update', $staff);

        $staff->update($request->only([
            'username', 'email', 'phone', 'gender', 'avatar', 'date_of_birth'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành công',
            'user' => $staff
        ]);
    }

    /**
     * Cập nhật trạng thái active/inactive
     */
    public function updateStaffStatus(Request $request, $id)
    {
        $staff = User::findOrFail($id);
        $this->authorize('update', $staff);

        $staff->status = $request->status;
        $staff->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái thành công',
            'user' => $staff
        ]);
    }

    public function createStaff(UserRequest $request){
        $this->authorize('create', User::class);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'gender' => $request->gender,
            'avatar' => $request->avatar,
            'date_of_birth' => $request->date_of_birth,
            'status' => 'active'
        ]);

        $staffRole = Role::firstOrCreate(
            ['name' => 'staff'],
            ['description' => 'Nhân viên của hệ thống']
        );

        // Gán role
        $user->roles()->syncWithoutDetaching($staffRole->id);

        return response()->json([
            'message' => 'Nhân viên đã được tạo và gán role staff',
            'user' => $user
        ]);
    }
}