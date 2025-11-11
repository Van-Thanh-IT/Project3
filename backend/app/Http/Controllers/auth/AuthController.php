<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ForgotPasswordRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
   // Hàm đăng ký
    public function register(RegisterUserRequest $request){
         $user=  DB::transaction(function () use ($request) {
            // Tạo user
            $user = User::create([ 
                'username' => $request->username,
                'email'    => $request->email,
                'password' => bcrypt($request->password),
                'phone'    => $request->phone  
            ]);

            $this->assignDefaultRole( $user);
            // Ẩn password trước khi trả về
            $user->makeHidden(['password']);
         });

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user'    => $user
        ], 201);
    }

    // hàm đăng nhập
    public function login(Request $request){
        $credentials = $request->only('email', 'password');
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Bạn chưa đăng nhập!'], 401);
        }
        return $this->respondWithToken($token);
    }

    // hàm quên mật khẩu
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => __($status)
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => __($status)
            ], 500);
        }
    }

     public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Đặt lại mật khẩu thành công']);
        }

        return response()->json(['message' => __($status)], 400);
    }

    
    // lấy thoại người dùng hiện tại
    public function me(){
        return response()->json(auth()->user());
    }

    //hàm logout
    public function logout(){
        auth()->logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    //hàm refresh token
    public function refresh(){
        return $this->respondWithToken(auth()->refresh());
    }

    //hàm đăng hướng tới đăng nhập google
    public function redirectToGoogle(){
        try {
            $redirectUrl = Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();
             return response()->json([
                'success' => true,
                'url' => $redirectUrl
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating Google login URL',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function loginWithGoogle(){
        try {
            $googleUser = Socialite::driver('google')
            ->stateless()
            ->user();
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'username' => $googleUser->getName(),
                    'provider_id' => $googleUser->getId(),
                    'password' => bcrypt(uniqid()),
                    'provider' => 'google',
                    'avatar' => $googleUser->getAvatar()
                ]
            );

            $this->assignDefaultRole($user);

            $token = JWTAuth::fromUser($user);  
            return  $this->respondWithToken($token);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi đăng nhập google',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //hàm đăng hướng tới đăng nhập facebook
     public function redirectToFacebook(){
        try {
        $redirectUrl = Socialite::driver('facebook')
            ->stateless()
            ->scopes(['email'])
            ->redirect()
            ->getTargetUrl();

        return response()->json([
            'success' => true,
            'url' => $redirectUrl
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error generating Facebook login URL',
            'error' => $e->getMessage()
        ], 500);
    }
    }

    //hàm đăng nhập tới facebook
    public function loginWithFacebook(Request $request)
    {
         try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            
            $user = User::create([
                'username' => $facebookUser->getName(),
                'email' => $facebookUser->getId() . '@facebook.com',
                'provider_id' => $facebookUser->getId(),
                'provider' => 'facebook',
                'password' => bcrypt(uniqid()),
                'avatar' => $facebookUser->getAvatar(),
            ]);

            $this->assignDefaultRole($user);
        
            $token = JWTAuth::fromUser($user);
            return $this->respondWithToken($token);

             
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi đăng nhập Facebook!',
                'error' => $e->getMessage()
            ]);
        }
    }
        
     protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }


    
    // Hàm để gán vai trò mặc định
    private function assignDefaultRole(User $user)
    {
        // Kiểm tra xem người dùng đã có vai trò nào chưa
        if ($user->roles()->count() === 0) {
            $defaultRole = Role::where('name', 'use')->first();
            if ($defaultRole) {
                $user->roles()->syncWithoutDetaching($defaultRole->id);
            } else {
                // Xử lý trường hợp vai trò 'user' chưa tồn tại
                $role = Role::create([
                    'name' => 'user',
                    'description' => 'Vai trò người dùng'
                ]);
                $user->roles()->syncWithoutDetaching($role->id);
            }
        }
    }
}
