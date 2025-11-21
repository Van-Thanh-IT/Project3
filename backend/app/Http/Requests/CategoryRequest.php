<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2|max:50|unique:categories,name',
            'parent_id'   => 'nullable|exists:categories,id',
            'status'      => 'nullable|in:0,1',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'description' => 'nullable|string|max:2000',

        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên danh mục!',
            'name.min'      => 'Tên danh mục quá ngắn (tối thiểu 2 ký tự)!',
            'name.max'      => 'Tên danh mục quá dài (tối đa 50 ký tự)!',
            'name.unique'  => "Tên danh mục đã tồn tại trong hệ thống!",

            'parent_id.exists' => 'Danh mục cha không tồn tại!',

            'status.in'        => 'Trạng thái không hợp lệ!',

            'image.image' => 'Tệp tải lên phải là hình ảnh!',
            'image.mimes' => 'Hình ảnh phải có dạng: jpeg, png, jpg, gif hoặc webp!',
            'image.max'   => 'Dung lượng ảnh tối đa 2MB!',

            'description.max' => 'Mô tả quá dài, tối đa 2000 ký tự!',
        ];
    }
}
