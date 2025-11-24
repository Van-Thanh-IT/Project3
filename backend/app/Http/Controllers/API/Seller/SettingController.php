<?php

namespace App\Http\Controllers\API\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop;
use Illuminate\Support\Str;
use App\Traits\CloudinaryUploadTrait;
use Illuminate\Support\Facades\Validator;
class SettingController extends Controller
{
   use CloudinaryUploadTrait;
    public function getShops(){
        $shops = Shop::where('seller_id', auth()->user()->id)->get();
        return response()->json([
            'status' => 'success',
            'data' => $shops
        ]);
    }
    public function createShop(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:shops,name', 
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first() // trả về lỗi đầu tiên
            ], 400);
        }

        try {
            $avatar = null;
            if($request->hasFile('avatar')) {
                $avatar = $this->uploadToCloudinary($request->file('avatar'));
            } 
            $shop = Shop::create([
                'seller_id' => auth()->user()->id,
                'name' => $request->name,
                'slug' => Str::slug($request->name, '-'),
                'description' => $request->description,
                'avatar' => $avatar
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo shop thành công!',
                'data' => $shop
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo shop: ' . $e->getMessage()
            ], 500);
        }
    }

   public function updateShop(Request $request, $id){
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255|unique:shops,name,' . $id, // bỏ qua shop hiện tại
        'description' => 'nullable|string',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // đổi giống createShop
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => $validator->errors()->first()
        ], 400);
    }

    try {
        $shop = Shop::findOrFail($id);
        if ($shop->seller_id != auth()->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền sửa shop này'
            ], 403);
        }

        // Upload avatar nếu có file
        if ($request->hasFile('avatar')) {
            $avatar = $this->uploadToCloudinary($request->file('avatar'));
            $shop->avatar = $avatar;
        }

        $shop->name = $request->name ?? $shop->name;
        $shop->slug = $request->name ? Str::slug($request->name, '-') : $shop->slug;
        $shop->description = $request->description ?? $shop->description;

        $shop->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật shop thành công!',
            'data' => $shop
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Lỗi khi cập nhật shop: ' . $e->getMessage()
        ], 500);
    }
}

}
