<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{

    public function getALlCategories()
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
        $maxOrder = Category::where('parent_id', $request->parent_id)
            ->max('sort_order');

        $newSortOrder = ($maxOrder !== null ? $maxOrder + 1 : 1);

        $category = Category::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'parent_id'   => $request->parent_id,
            'description' => $request->description,
            'image'       => $request->image,
            'status'      => $request->status ?? 1,
            'sort_order'  => $newSortOrder,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Tạo danh mục thành công',
            'data' => $category
        ], 201);
    }

    /**
     * Xem chi tiết danh mục
     */
    public function getCatygoryById($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    /**
     * Cập nhật danh mục
     */
    public function updateCategory(CategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update([
            'name'        => $request->name ?? $category->name,
            'slug'        => $request->name ? Str::slug($request->name) : $category->slug,
            'parent_id'   => $request->parent_id ?? $category->parent_id,
            'description' => $request->description ?? $category->description,
            'image'       => $request->image ?? $category->image,
            'status'      => $request->status ?? $category->status,
            'sort_order'  => $request->sort_order ?? $category->sort_order,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => $category
        ]);
    }

    /**
     * Ẩn / Hiện danh mục (toggle)
     */
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