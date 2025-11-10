<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(User $user)
    {
        $this->authorize('product_view', $user);
        return "Xem sản phẩm";
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(User $user)
    {
      
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(User $user)
    {
         $this->authorize('product_create', $user);
         return "Tạo sản phẩm";
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
