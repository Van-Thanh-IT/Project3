<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Hoặc dùng policy nếu muốn
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
            'avatar'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // file upload
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

            'phone.string'      => 'Số điện thoại phải là chuỗi ký tự',
            'phone.max'         => 'Số điện thoại không quá 20 ký tự',

            'gender.in'         => 'Giới tính không hợp lệ',

            'date_of_birth.date' => 'Ngày sinh không hợp lệ',

            'avatar.image'      => 'File avatar phải là hình ảnh',
            'avatar.mimes'      => 'Ảnh avatar chỉ chấp nhận jpeg, png, jpg, gif',
            'avatar.max'        => 'Ảnh avatar tối đa 2MB',
        ];
    }
}
