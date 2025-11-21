<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Models\ShopApplication;
use App\Models\User;

class SellerController extends Controller
{
    public function getAllSellers(){
        $sellers = User::whereHas('roles', function ($query) {
            $query->where('name', 'seller');
        })->get();

        return response()->json($sellers);
    }
   /**
     * Lấy danh sách seller đang chờ duyệt
     */
    public function pending()
    {
        $pending = ShopApplication::with('user')
            ->where('status', 'pending')
            ->get();
        return response()->json($pending);
    }

    public function approve($id)
    {
        $profile = ShopApplication::findOrFail($id);

        if ($profile->status === 'approved') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Hồ sơ này đã được duyệt trước đó.'
            ], 400);
        }

        // Cập nhật trạng thái
        $profile->update(['status' => 'approved']);

        // Tìm hoặc tạo role "seller"
        $role = Role::firstOrCreate(['name' => 'seller']);

        // Gán quyền cho user
        DB::table('user_roles')->insertOrIgnore([
            'user_id' => $profile->user_id,
            'role_id' => $role->id,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Duyệt yêu cầu seller thành công.',
            'user_id' => $profile->user_id
        ]);
    }

    
    // public function approve($id)
    // {
    //     $profile = ShopApplication::findOrFail($id);

    //     if ($profile->status === 'approved') {
    //         return response()->json([
    //             'status'  => 'error',
    //             'message' => 'Hồ sơ này đã được duyệt trước đó.'
    //         ], 400);
    //     }

    //     // 1. Cập nhật trạng thái hồ sơ
    //     $profile->update(['status' => 'approved']);

    //     // 2. Tìm hoặc tạo role "seller"
    //     $role = Role::firstOrCreate(['name' => 'seller']);

    //     // 3. Gán quyền cho user
    //     DB::table('user_roles')->insertOrIgnore([
    //         'user_id' => $profile->user_id,
    //         'role_id' => $role->id,
    //     ]);

    //     // 4. Tạo shop mặc định nếu chưa có
    //     $user = User::find($profile->user_id);
    //     if (!$user->shop) {
    //         $slug = \Str::slug($user->username . '-shop');
    //         \App\Models\Shop::create([
    //             'seller_id' => $user->id,
    //             'name' => $user->username . ' Shop',
    //             'slug' => $slug,
    //             'description' => 'Cửa hàng mặc định được tạo bởi hệ thống',
    //             'avatar' => 'default.png',
    //         ]);
    //     }

    //     return response()->json([
    //         'status'  => 'success',
    //         'message' => 'Duyệt yêu cầu seller thành công và tạo shop mặc định.',
    //         'user_id' => $profile->user_id
    //     ]);
    // }

    /**
     * Admin từ chối seller
     */
     public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string'
        ]);

        $profile = ShopApplication::findOrFail($id);

        // Kiểm tra nếu đã từ chối rồi thì không làm gì thêm
        if ($profile->status === 'rejected') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Hồ sơ này đã bị từ chối trước đó.'
            ], 400);
        }

        $profile->status = 'rejected';
        $profile->reject_reason = $request->reason; 
        $profile->save();

        return response()->json([
            'status'  => 'success',
            'message' => "Hồ sơ seller đã được cập nhật trạng thái từ chối. Lý do: {$request->reason}"
        ]);
    }

    // 2. Hàm Revoke (Thu hồi)
    public function revokeSeller($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User không tồn tại'], 404);

        $sellerRole = Role::where('name', 'seller')->first();
        
        // Gỡ quyền
        $user->roles()->detach($sellerRole->id); 

        // Cập nhật trạng thái hồ sơ thành 'revoked' (Sau khi đã chạy lệnh SQL ở Bước 1)
        // Nếu bạn KHÔNG muốn chạy SQL, hãy đổi 'revoked' thành 'rejected' ở dòng dưới
        ShopApplication::where('user_id', $id)->update([
            'status' => 'revoked' 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã thu hồi quyền seller.',
            'id' => $id
        ]);
    }



    // ... Các hàm cũ giữ nguyên

    /**
     * 1. Lấy danh sách các hồ sơ bị Từ chối hoặc Thu hồi
     * Để hiển thị lên Tab riêng cho Admin quản lý
     */
    public function getRevokedList()
    {
        $list = ShopApplication::with('user')
            ->whereIn('status', ['rejected', 'revoked']) // Lấy cả 2 trạng thái này
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($list);
    }

    /**
     * 2. Khôi phục quyền Seller (Thực chất là gọi lại logic Approve)
     * Bạn có thể dùng lại route approve cũ, hoặc viết hàm này để rõ nghĩa hơn
     */
    public function restore($id)
    {
        $profile = ShopApplication::findOrFail($id);

        // Nếu đang là seller rồi thì báo lỗi
        if ($profile->status === 'approved') {
             return response()->json(['message' => 'User này đang là Seller rồi.'], 400);
        }

        // A. Cập nhật trạng thái
        $profile->update([
            'status' => 'approved',
            'reason' => null // Xóa lý do từ chối cũ (nếu có) cho sạch data
        ]);

        // B. Tìm hoặc tạo role "seller"
        $role = Role::firstOrCreate(['name' => 'seller']);

        // C. Cấp lại quyền (Dùng insertOrIgnore hoặc firstOrCreate để tránh lỗi duplicate)
        DB::table('user_roles')->insertOrIgnore([
            'user_id' => $profile->user_id,
            'role_id' => $role->id,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Đã khôi phục quyền Seller thành công.',
            'user_id' => $profile->user_id
        ]);
    }

}
