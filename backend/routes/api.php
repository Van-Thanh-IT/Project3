<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\Admin\PermissionController;
use App\Http\Controllers\API\Admin\ProductController as AdminProductController;
use App\Http\Controllers\API\Admin\CategoryController;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\API\Admin\StaffController;

use App\Http\Controllers\API\Seller\ShopApplicationController;
use App\Http\Controllers\API\Seller\ProductController as SellerProductController;

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
    Route::get('/', [CategoryController::class, 'getALlCategories']);
    Route::post('/', [CategoryController::class, 'createCategory']);
    Route::get('/{id}', [CategoryController::class, 'getCatygoryById']);
    Route::put('/{id}', [CategoryController::class, 'updateCategory']);
    Route::patch('/{id}/toggle', [CategoryController::class, 'toggleStatus']);
   });
});

Route::middleware(["auth:jwt", "check.role:staff"])->prefix("staff")->group(function(){
        
    Route::prefix("product")->group(function(){
        Route::get("/", [SellerProductController::class, "index"]);
        Route::post("/", [SellerProductController::class, "store"]);
        Route::put("/{id}", [SellerProductController::class, "update"]);
        Route::delete("/{id}", [SellerProductController::class, "destroy"]);
    });

});

Route::middleware(["auth:jwt", "check.role:seller"])->prefix("seller")->group(function(){
    
});

Route::middleware(["auth:jwt", "check.role:user"])->prefix("user")->group(function(){
    Route::post('register', [ShopApplicationController::class, 'register']); 
    Route::get('my-profile', [ShopApplicationController::class, 'myProfile']);
});



