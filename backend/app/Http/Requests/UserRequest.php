<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username'      => 'required|string|max:100',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:6',
            'phone'         => 'nullable|string|max:20',
            'gender'        => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'avatar'        => 'nullable|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Vui lòng nhập họ tên',
            'username.string'   => 'Họ tên phải là chuỗi ký tự',
            'username.max'      => 'Họ tên không được vượt quá 100 ký tự',

            'email.required'    => 'Vui lòng nhập email',
            'email.email'       => 'Email không hợp lệ',
            'email.unique'      => 'Email đã tồn tại',

            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.string'   => 'Mật khẩu phải là chuỗi ký tự',
            'password.min'      => 'Mật khẩu tối thiểu 6 ký tự',
            // 'password.confirmed'=> 'Xác nhận mật khẩu không khớp',

            'phone.string'      => 'Số điện thoại phải là chuỗi ký tự',
            'phone.max'         => 'Số điện thoại không quá 20 ký tự',

            'gender.in'         => 'Giới tính không hợp lệ',
            'avatar.url'        => 'Đường dẫn ảnh không hợp lệ',
            'avatar.max'        => 'Đường dẫn ảnh không quá 500 ký tự',
        ];
    }
}
