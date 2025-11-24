<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\Admin\PermissionController;
use App\Http\Controllers\API\Admin\CategoryController;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\API\Admin\StaffController;

use App\Http\Controllers\API\Seller\ShopApplicationController;
use App\Http\Controllers\API\Seller\ProductController;
use App\Http\Controllers\API\Seller\SettingController as SellerSettingController;

// nhóm auth
Route::prefix("auth")->group(function(){
    // public routes
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/google/login", [AuthController::class, "loginWithGoogle"]);
    Route::post("/facebook/login", [AuthController::class, "loginWithFacebook"]);
    Route::post("/forgot-password", [AuthController::class, "forgotPassword"]);
    Route::post('/reset-password', [AuthController::class, 'reset'])->name('password.reset');
     
    //protected routes
    Route::middleware('auth:jwt')->group(function(){
        Route::post("/logout", [AuthController::class, "logout"]);
        Route::post("/refresh-token", [AuthController::class, "refresh"]);
        Route::post("/me", [AuthController::class, "me"]);
    });  
});


// chỉ admin có quyền
Route::middleware(["auth:jwt", "check.role:admin"])->prefix("admin")->group(function(){
   
    Route::prefix("permissions")->group(function(){
    Route::get('/', [PermissionController::class, 'getPermissionsWithStaffStatus']);
    Route::post('/', [PermissionController::class, 'createPermission']);
    Route::post('/assign', [PermissionController::class, 'assignPermissionToStaff']);
    });

    Route::prefix("staffs")->group(function(){
        Route::get('/', [StaffController::class, 'getAllStaffs']);        
        Route::get('{id}', [StaffController::class, 'getStaffById']);      
        Route::post('/', [StaffController::class, 'createStaff']);        
        Route::put('{id}', [StaffController::class, 'updateStaff']);      
        Route::patch('{id}/status', [StaffController::class, 'updateStaffStatus']);
    });

    Route::prefix("users")->group(function(){
        Route::get("/", [UserController::class, "index"]);
        Route::get("/{id}", [UserController::class, "show"]);
        Route::put("/{id}/status", [UserController::class, "updateStatus"]);
    });

    Route::prefix("sellers")->group(function(){
        Route::get('/', [AdminSellerController::class, 'getAllSellers']);      
        Route::get('/pending', [AdminSellerController::class, 'pending']);              
        Route::post('/approve/{id}', [AdminSellerController::class, 'approve']); 
        Route::post('/reject/{id}', [AdminSellerController::class, 'reject']);   
       Route::post('/revoke/{id}', [AdminSellerController::class, 'revokeSeller']);
        Route::get('/revoked', [AdminSellerController::class, 'getRevokedList']); 
        Route::post('/restore/{id}', [AdminSellerController::class, 'restore']);
    });

   Route::prefix("categories")->group(function(){
    Route::post('/', [CategoryController::class, 'createCategory']);
    Route::get('/{id}', [CategoryController::class, 'getCatygoryById']);
    Route::put('/{id}', [CategoryController::class, 'updateCategory']);
    Route::patch('/{id}/toggle', [CategoryController::class, 'toggleStatus']);
   });
});

// chỉ nhân viên và admin có quyền
Route::middleware(["auth:jwt", "check.role:staff,admin"])->prefix("staff")->group(function(){
});


// chỉ seller và admin có quyền
Route::middleware(["auth:jwt", "check.role:seller,admin"])->prefix("seller")->group(function(){
        
    Route::prefix("settings")->group(function(){
        Route::get("/shop", [SellerSettingController::class, "getShops"]);
        Route::post("/shop", [SellerSettingController::class, "createShop"]);
        Route::put("/shop/{id}", [SellerSettingController::class, "updateShop"]);
    });
});

Route::middleware(["auth:jwt", "check.role:user,admin"])->prefix("user")->group(function(){
    Route::post('/registerSeller', [ShopApplicationController::class, 'register']); 
    Route::get('my-profile', [ShopApplicationController::class, 'myProfile']);
});

// dùng chung controller admin và seller
Route::middleware(["auth:jwt", 'check.role:seller,admin'])->group(function(){
    Route::prefix("products")->group(function(){
        Route::get('/', [ProductController::class, 'getAllProducts']);
        Route::post("/", [ProductController::class, "createProduct"]);
        Route::put("/{id}", [ProductController::class, "updateProduct"]);
        Route::put('/{id}/status', [ProductController::class, 'updateProductStatus']);
    });

    Route::get('/categories', [CategoryController::class, 'getAllCategories']);
});
