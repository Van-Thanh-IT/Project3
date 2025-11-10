<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

    public function index(){
       $this->authorize('viewAny', User::class);
        return "Xem thông tin người dùng";
    }

    public function store(){
        $this->authorize('create', User::class); // OK
        return "Tạo thông tin người dùng";
    }
}
