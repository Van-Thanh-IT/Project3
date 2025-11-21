<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    /**
     * Lấy danh sách người dùng (phân trang + tìm kiếm + lọc)
     * /admin/users
     */
   public function index(Request $request)
{
    $query = User::with('roles');

    // Search theo name, email, phone
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%$search%")
              ->orWhere('email', 'LIKE', "%$search%")
              ->orWhere('phone', 'LIKE', "%$search%");
        });
    }

    // Lọc theo role
    if ($request->filled('role')) {
        $role = $request->role;
        $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }

    // Lọc trạng thái
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Pagination 10 item / page
    $users = $query->paginate(10);

    // Trả về JSON: data + pagination info
    return response()->json($users);
}

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,banned'
        ]);

        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        return response()->json([
            "message" => "Cập nhật trạng thái thành công",
            "user" => $user
        ]);
    }

}
