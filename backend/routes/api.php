<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\ProductController;
 
// nhóm auth
Route::prefix("auth")->group(function(){
    // public routes
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::get("/google", [AuthController::class, "redirectToGoogle"]);
    Route::get("/google/callback", [AuthController::class, "loginWithGoogle"]);
    Route::get("/facebook", [AuthController::class, "redirectToFacebook"]);
    Route::get("/facebook/callback", [AuthController::class, "loginWithFacebook"]);
    Route::post("/forgot-password", [AuthController::class, "forgotPassword"]);
    Route::post('/password/reset', [AuthController::class, 'reset'])->name('password.reset');;
    
    //protected routes
    Route::middleware('auth:jwt')->group(function(){
        Route::post("/logout", [AuthController::class, "logout"]);
        Route::post("/refresh", [AuthController::class, "refresh"]);
        Route::post("/me", [AuthController::class, "me"]);
    });
});

Route::middleware(["auth:jwt", "check.role:admin"])->prefix("admin")->group(function(){
    Route::prefix("permissions")->group(function(){
        Route::get("/", [PermissionController::class, "index"]);
        Route::post("/", [PermissionController::class, "store"]);
        Route::get("/{id}", [PermissionController::class, "show"]);
        Route::put("/{id}", [PermissionController::class, "update"]);
        Route::delete("/{id}", [PermissionController::class, "destroy"]);
    });

  
});

Route::middleware(["auth:jwt", "check.role:staff"])->prefix("staff")->group(function(){
        
    Route::prefix("products")->group(function(){
        Route::get("/", [ProductController::class, "index"]);
        Route::post("/", [ProductController::class, "store"]);
        Route::get("/{id}", [ProductController::class, "show"]);
        Route::put("/{id}", [ProductController::class, "update"]);
        Route::delete("/{id}", [ProductController::class, "destroy"]);
    });
});

Route::middleware(["auth:jwt", "check.role:seller"])->prefix("seller")->group(function(){
    
});

Route::middleware(["auth:jwt", "check.role:user"])->prefix("user")->group(function(){
    
});


