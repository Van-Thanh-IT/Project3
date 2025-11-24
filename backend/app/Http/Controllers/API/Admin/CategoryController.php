<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Traits\CloudinaryUploadTrait;

class CategoryController extends Controller
{
    use CloudinaryUploadTrait;

    public function getAllCategories()
    {
        $categories = Category::with('parent')
            ->orderBy('sort_order', 'ASC')
            ->get();

        return response()->json($categories);
    }

    /**
     * Tạo danh mục
     */
   public function createCategory(CategoryRequest $request)
    {
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imageUrl = $this->uploadToCloudinary($request->file('image'));
        }

        // Sinh slug từ tên
        $slug = Str::slug($request->name);

        // Kiểm tra xem slug đã tồn tại chưa
        if (Category::where('slug', $slug)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Tên danh mục hoặc slug đã tồn tại!'
            ], 400);
        }

        $maxOrder = Category::where('parent_id', $request->parent_id)->max('sort_order');
        $newSortOrder = ($maxOrder !== null ? $maxOrder + 1 : 1);

        $category = Category::create([
            'name'        => $request->name,
            'slug'        => $slug,
            'parent_id'   => $request->parent_id,
            'description' => $request->description,
            'image'       => $imageUrl,
            'sort_order'  => $newSortOrder,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Tạo danh mục thành công',
            'data' => $category
        ], 201);
    }

    public function updateCategory(CategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $imageUrl = null; 

        // Upload ảnh mới nếu có
        if ($request->hasFile('image')) {
            $imageUrl = $this->uploadToCloudinary($request->file('image'));
        } else {
            $imageUrl = $category->image; 
        }

        $slug = Str::slug($request->name);
        if (Category::where('name', $slug)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'Tên danh mục hoặc slug đã tồn tại!'
            ], 400); 
        }

        $category->update([
            'name'        => $request->name ?? $category->name,
            'slug'        => $request->name ? Str::slug($request->name) : $category->slug,
            'parent_id'   => $request->parent_id ?? $category->parent_id,
            'description' => $request->description ?? $category->description,
            'image'       => $imageUrl ?? $category->image,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => $category
        ]);
    }

    public function getCatygoryById($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);

        $category->status = !$category->status;
        $category->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'data' => ['status' => $category->status]
        ]);
    }
}