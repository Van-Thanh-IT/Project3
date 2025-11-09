<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|max:50|unique:permissions,name',
            'description' => 'nullable|max:50',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Vui lòng nhập tên quyền',
            'name.max' => 'Tên quyền không được vượt quá 50 ký tự',
            'name.unique' => 'Tên quyền đã tồn tại trong hệ thống',
            'description.max' => 'Mô tả không được vượt quá 50 ký tự',
        ];
    }
}
