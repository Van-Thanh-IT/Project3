<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Allow all authenticated users to use this request
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // PRODUCT
            // 'shop_id'       => 'required|integer|exists:shops,id',
            'category_id'   => 'required|integer|exists:categories,id',
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',

            // // IMAGES
            'images'                 => 'required|array|min:1',
            'images.*.url'           => 'required|file|image|max:5120',
            'images.*.is_primary'    => 'boolean',

            // VARIANTS
            'variants'               => 'required|array|min:1',
            'variants.*.color'       => 'required|string',
            'variants.*.size'        => 'required|string',
            'variants.*.price'       => 'nullable|numeric|min:0',

            // ATTRIBUTES for each variant
            'variants.*.attributes'                      => 'nullable|array',
            'variants.*.attributes.*.attribute_name'     => 'required_with:variants.*.attributes|string',
            'variants.*.attributes.*.attribute_value'    => 'required_with:variants.*.attributes|string',
        ];
    }

    /**
     * Custom error messages
     */
    public function messages(): array
    {
        return [
            // PRODUCT
            // 'shop_id.required'       => 'Vui lòng chọn cửa hàng.',
            'shop_id.exists'         => 'Cửa hàng không tồn tại.',
            'category_id.required'   => 'Vui lòng chọn danh mục.',
            'category_id.exists'     => 'Danh mục không tồn tại.',
            'name.required'          => 'Tên sản phẩm không được bỏ trống.',
            'price.required'         => 'Giá sản phẩm là bắt buộc.',
            'price.numeric'          => 'Giá sản phẩm phải là số.',
            'price.min'              => 'Giá sản phẩm phải lớn hơn 0.',

            // IMAGES
            'images.required'             => 'Vui lòng chọn ít nhất 1 ảnh sản phẩm.',
            'images.*.url.required'       => 'Vui lòng tải lên ảnh sản phẩm.',
            'images.*.url.image'          => 'File phải là ảnh hợp lệ.',
            'images.*.url.max'            => 'Ảnh không được lớn hơn 5MB.',
            
            // VARIANTS
            'variants.required'           => 'Vui lòng thêm ít nhất 1 phiên bản (variant).',
            'variants.*.color.required'   => 'Mỗi variant phải có màu.',
            'variants.*.size.required'    => 'Mỗi variant phải có size.',
        
            // ATTRIBUTES
            'variants.*.attributes.*.attribute_name.required_with'  => 'Tên thuộc tính không được để trống.',
            'variants.*.attributes.*.attribute_value.required_with' => 'Giá trị thuộc tính không được để trống.',
        ];
    }
}
