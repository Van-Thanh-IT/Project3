<?php

namespace App\Http\Controllers\API\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use Illuminate\Support\Str;
use App\Traits\CloudinaryUploadTrait;
use App\Http\Requests\ProductRequest;
use App\Models\Category;

class ProductController extends Controller
{
    use CloudinaryUploadTrait;
    public function getAllProducts()
    {
        $shopId = auth()->user()->shop->id;

        $products = Product::with([
            'images',              
            'variants',             
            'variants.attributes',                      
        ])
        ->where('shop_id', $shopId)
        ->get();

        return response()->json([
            'shop_id' => $shopId,
            'products' => $products
        ]);
    }

   public function createProduct(ProductRequest $request)
    {
        DB::beginTransaction();

        try {
            if (!auth()->user()->shop) {
                return response()->json([
                    'message' => 'Shop chưa được tạo, vui lòng tạo shop để bán hàng'
                ], 400);
            }

            // 1. Tạo sản phẩm cha
            $product = Product::create([
                'shop_id'       => auth()->user()->shop->id, 
                'category_id'   => $request->category_id,
                'name'          => $request->name,
                'slug'          => Str::slug($request->name) . '-' . Str::random(5),
                'description'   => $request->description,
                'price'         => $request->price,
            ]);

            // 2. Upload Images
            if ($request->has('images')) {
                foreach ($request->images as $index => $img) {
                    $uploadedUrl = null;
                    if ($request->hasFile("images.$index.url")) {
                        $uploadedUrl = $this->uploadToCloudinary($request->file("images.$index.url"));
                    }

                    if ($uploadedUrl) {
                        ProductImage::create([
                            'product_id' => $product->id,
                            'url'        => $uploadedUrl,
                            'public_id'  => null, // Tạm thời để null vì Trait chỉ trả về URL
                            'is_primary' => filter_var($img['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN), // Parse boolean an toàn
                        ]);
                    }
                }
            }

            // 3. Create Variants
            if ($request->has('variants')) {
                foreach ($request->variants as $v) {

                    $sku = $v['sku'] ?? $this->generateSKU($request->name, $v['color'], $v['size']);
                    $variant = ProductVariant::create([
                        'product_id' => $product->id,
                        'color'      => $v['color'] ?? null,
                        'size'       => $v['size'] ?? null,
                        'sku'        => $sku ?? null,
                        'price'      => $v['price'] ?? $product->price, // Nếu ko có giá riêng thì lấy giá chung
                    ]);

                    // 4. Create Attributes for Variant
                    if (!empty($v['attributes']) && is_array($v['attributes'])) {
                        foreach ($v['attributes'] as $attr) {
                            if(!empty($attr['attribute_name']) && !empty($attr['attribute_value'])){
                                ProductAttribute::create([
                                    'variant_id'      => $variant->id,
                                    'attribute_name'  => $attr['attribute_name'],
                                    'attribute_value' => $attr['attribute_value'],
                                ]);
                            }
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Thêm sản phẩm thành công!',
                'data'    => Product::with(['images', 'variants.attributes'])->find($product->id)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Log lỗi để debug dễ hơn
            \Log::error("Create Product Error: " . $e->getMessage());
            
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProduct(ProductRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            $slug = $request->slug ?? $product->slug;
            $product->update([
                'category_id' => $request->category_id,
                'name'        => $request->name,
                'slug'        => $slug,
                'description' => $request->description ?? '',
                'price'       => $request->price
            ]);

            // 2. Xoá ảnh cũ không giữ lại
            $oldImageIds = $request->old_image_ids ?? [];
            $imagesToDelete = ProductImage::where('product_id', $id)
                ->whereNotIn('id', $oldImageIds)
                ->get();

            foreach ($imagesToDelete as $img) {
                if (!empty($img->public_id)) $this->deleteFromCloudinary($img->public_id);
                $img->delete();
            }

           // 3. Upload ảnh mới
            if ($request->has('images')) { // Kiểm tra có mảng images không
                foreach ($request->images as $index => $img) {
                    // Kiểm tra kỹ: Có file upload tại key 'url' không?
                    if ($request->hasFile("images.$index.url")) {
                        $file = $request->file("images.$index.url");
                        $res = $this->uploadToCloudinary($file);
                        
                        ProductImage::create([
                            'product_id' => $product->id,
                            'url'        => $res['url'],
                            'public_id'  => $res['public_id'],
                            // Lấy is_primary từ request input
                            'is_primary' => filter_var($img['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        ]);
                    }
                }
            }

            // 4. Xử lý Variants
            $variants = $request->input('variants', []);
            $keepVariantIds = [];

            foreach ($variants as $v) {
                if (!is_array($v)) continue;
                    $sku = $v['sku'] ?? $this->generateSKU($request->name, $v['color'], $v['size']);
                $variantData = [
                    'color' => $v['color'] ?? null,
                    'size'  => $v['size'] ?? null,
                    'sku'   => $sku ?? null,
                    'price' => $v['price'] ?? $product->price,
                ];

                if (isset($v['id'])) {
                    $variant = ProductVariant::where('product_id', $product->id)->where('id', $v['id'])->first();
                    if ($variant) $variant->update($variantData);
                } else {
                    $variant = ProductVariant::create(array_merge(['product_id' => $product->id], $variantData));
                }

                $keepVariantIds[] = $variant->id;

                // 5. Xử lý Attributes
                ProductAttribute::where('variant_id', $variant->id)->delete();

                $attributes = $v['attributes'] ?? [];
                if (is_array($attributes)) {
                    foreach ($attributes as $a) {
                        if (!is_array($a)) continue;
                        if (!empty($a['attribute_name']) && !empty($a['attribute_value'])) {
                            ProductAttribute::create([
                                'variant_id'      => $variant->id,
                                'attribute_name'  => $a['attribute_name'],
                                'attribute_value' => $a['attribute_value'],
                            ]);
                        }
                    }
                }
            }

            // 6. Xoá variant thừa
            ProductVariant::where('product_id', $product->id)->whereNotIn('id', $keepVariantIds)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công!',
                'product' => Product::with(['images', 'variants', 'variants.attributes'])->find($id)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Update Product Error: {$e->getMessage()} at Line {$e->getLine()}");
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }


        
    }

    private function generateSKU($name, $color, $size)
    {
        $prefix = strtoupper(Str::slug($name, '-'));
        $colorCode = strtoupper(Str::slug($color, '-'));
        $sizeCode = strtoupper($size);

        $random = rand(1000, 9999);

        return "{$prefix}-{$colorCode}-{$sizeCode}-{$random}";
    }

    public function updateProductStatus(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) return response()->json(['message' => 'Sản phẩm không tồn tại!'], 404);

        $status = $request->status;
        $validStatuses = ['pending_approval', 'active', 'archived', 'banned'];
        if (!in_array($status, $validStatuses)) {
            return response()->json(['message' => 'Trạng thái không hợp lệ!'], 400);
        }

        $product->status = $status;
        $product->save();

        return response()->json([
            'message' => "Cập nhật trạng thái sản phẩm thành công!",
            'product' => $product
        ], 200);
    }
}
