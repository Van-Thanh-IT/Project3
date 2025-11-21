<?php

namespace App\Http\Controllers\API\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ShopApplication;

class ShopApplicationController extends Controller
{
    /**
     * User gửi yêu cầu trở thành seller
     */
 public function register(Request $request)
    {
        // Validate dữ liệu
        $request->validate([
            'vat_number'   => 'nullable|string|max:50',
            'business_doc' => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'reason'       => 'nullable|string'
        ]);

        $user = Auth::user();

        // Kiểm tra hồ sơ cũ
        $existingApp = ShopApplication::where('user_id', $user->id)->first();

        if ($existingApp) {
            
            // 1. Nếu đang chờ duyệt
            if ($existingApp->status === 'pending') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Bạn đã gửi yêu cầu, vui lòng chờ Admin duyệt.'
                ], 400);
            }

            // 2. Nếu đã là Seller (Approved)
            if ($existingApp->status === 'approved') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Tài khoản của bạn đã được đăng ký quyền bán hàng.'
                ], 400);
            }

            // 3. Nếu bị Từ chối (rejected) hoặc Thu hồi (revoked)
            // ==> CHẶN ĐĂNG KÝ LẠI & YÊU CẦU LIÊN HỆ CSKH
            if (in_array($existingApp->status, ['rejected', 'revoked'])) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Hồ sơ của bạn đã bị từ chối hoặc thu hồi quyền bán hàng. Vui lòng liên hệ bộ phận Chăm sóc khách hàng (Hotline: 1900 0909) để được hỗ trợ giải quyết.'
                ], 403); 
            }
        }

        // --- Nếu chưa có hồ sơ nào thì tạo mới ---
        $profile = ShopApplication::create([
            'user_id'      => $user->id,
            'vat_number'   => $request->vat_number,
            'business_doc' => $request->business_doc,
            'address'      => $request->address,
            'phone'        => $request->phone,
            'reason'       => $request->reason,
            'status'       => 'pending',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Yêu cầu trở thành người bán đã được gửi!',
            'data'    => $profile
        ]);
    }

    /**
     * Xem trạng thái hồ sơ seller của user
     */
    public function myProfile()
    {
        $profile = ShopApplication::where('user_id', Auth::id())->first();
        return response()->json($profile);
    }
}
