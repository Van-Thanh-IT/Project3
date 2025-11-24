<?php

namespace App\Http\Controllers\API\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ShopApplication;
use App\Traits\CloudinaryUploadTrait;

class ShopApplicationController extends Controller
{
    use CloudinaryUploadTrait;
    public function register(Request $request)
    {
        // Validate dữ liệu
        $request->validate([
            'vat_number'   => 'nullable|string|max:50',
            'business_doc' => 'nullable|file|max:5120', // file tối đa 5MB
            'address'      => 'nullable|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'reason'       => 'nullable|string'
        ]);

        $user = Auth::user();

        // Kiểm tra hồ sơ cũ
        $existingApp = ShopApplication::where('user_id', $user->id)->first();

        if ($existingApp) {
            if ($existingApp->status === 'pending') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Bạn đã gửi yêu cầu, vui lòng chờ Admin duyệt.'
                ], 400);
            }
            if ($existingApp->status === 'approved') {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Tài khoản của bạn đã được đăng ký quyền bán hàng.'
                ], 400);
            }
            if (in_array($existingApp->status, ['rejected', 'revoked'])) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Hồ sơ của bạn đã bị từ chối hoặc thu hồi quyền bán hàng. Vui lòng liên hệ CSKH.'
                ], 403);
            }
        }

        // --- Upload file nếu có ---
        $fileUrl = null;
        if ($request->hasFile('business_doc')) {
            $file = $request->file('business_doc');
            $fileUrl = $this->uploadToCloudinary($file); 
        }

        // --- Tạo hồ sơ mới ---
        $profile = ShopApplication::create([
            'user_id'      => $user->id,
            'vat_number'   => $request->vat_number,
            'business_doc' => $fileUrl,
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
