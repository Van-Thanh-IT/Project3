<?php

namespace App\Traits;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
use Exception;
use Illuminate\Support\Facades\Log;

trait CloudinaryUploadTrait
{
    /**
     * Upload file lên Cloudinary
     *
     * @param UploadedFile $file File từ request (VD: $request->file('image'))
     * @param string $folder Tên folder trên Cloudinary
     * @return string|null Trả về URL ảnh hoặc null nếu lỗi
     */
    public function uploadToCloudinary(UploadedFile $file, $folder = 'uploads')
    {
        try {
            // Thực hiện upload
            $upload = Cloudinary::upload(
                $file->getRealPath(),
                ['folder' => $folder]
            );

            // Trả về đường dẫn HTTPS (Secure Path)
            return $upload->getSecurePath();
        } catch (Exception $e) {
            // Ghi log lỗi để debug nếu cần
            Log::error('Cloudinary Upload Error: ' . $e->getMessage());
            return null;
        }
    }

    public function deleteFromCloudinary($publicId)
    {
        try {
            return Cloudinary::destroy($publicId);
        } catch (Exception $e) {
            Log::error('Cloudinary Delete Error: ' . $e->getMessage());
            return false;
        }
    }
}