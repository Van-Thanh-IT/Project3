<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignPermissionRequest extends FormRequest
{
    /**
     * Xác định user có được phép gửi request này không
     */
    public function authorize(): bool
    {
        return true; // Hoặc kiểm tra quyền ở đây nếu muốn
    }

    /**
     * Các rule validation
     */
    public function rules(): array
    {
        return [
            'staff_ids' => 'required|array',
            'staff_ids.*' => 'integer|exists:users,id',
        ];
    }

    /**
     * Các thông báo lỗi tiếng Việt
     */
    public function messages()
    {
        return [
            'staff_ids.required' => 'Vui lòng chọn ít nhất một nhân viên',
            'staff_ids.array' => 'Dữ liệu nhân viên không hợp lệ',
            'staff_ids.*.integer' => 'ID nhân viên phải là số',
            'staff_ids.*.exists' => 'Nhân viên được chọn không tồn tại trong hệ thống',
        ];
    }
}
