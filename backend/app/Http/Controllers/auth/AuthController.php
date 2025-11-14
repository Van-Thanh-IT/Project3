<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
   // Hàm đăng ký
    public function register(RegisterUserRequest $request){
        Log::info($request->all());
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
        $token = auth()->attempt($credentials);
        if (!$token) {
            return response()->json(['message' => 'email hoặc mật khẩu không đúng!'], 401);
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
                'message' => "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn."
            ], Response::HTTP_OK); // 200
        }

        // Xử lý lỗi cụ thể
        if ($status === Password::RESET_THROTTLED) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn vừa yêu cầu reset, vui lòng đợi 1 phút trước khi thử lại.',
                'error' => __($status) 
            ], Response::HTTP_TOO_MANY_REQUESTS); // 429
        }

        // Các lỗi khác (ví dụ: Password::INVALID_USER - "passwords.user")
        return response()->json([
            'success' => false,
            'message' => 'Không tìm thấy người dùng với địa chỉ email này.',
            'error' => __($status)
        ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
    }

     public function reset(ResetPasswordRequest $request)
    {

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

        return response()->json(['message' => 'Mã đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.', 400]);
    }
    
    // lấy thoại người dùng hiện tại
    public function me(){
        $user = auth()->user();
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(), 
            'permissions' => $user->getAllPermissions()->pluck('name') 
        ]);
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

    //Hàm đăng nhập google
    public function loginWithGoogle(Request $request)
    {
        $googleToken = $request->token;

        try {
            // Lấy thông tin user từ Google token
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($googleToken);
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                $user->update([
                    'username' => $googleUser->getName(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                $user = User::create([
                    'email' => $googleUser->getEmail(),
                    'username' => $googleUser->getName(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(uniqid()),
                ]);
            }
            $this->assignDefaultRole($user);

            $token = JWTAuth::fromUser($user);
            return $this->respondWithToken($token);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi đăng nhập Google',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function loginWithFacebook(Request $request)
    {
        $fbToken = $request->token;
        try {
            // Lấy thông tin user từ Facebook token
            $fbUser = Socialite::driver('facebook')->stateless()->userFromToken($fbToken);
            $user = User::where('provider_id', $fbUser->getId())->first();

            if ($user) {
                $user->update([
                    'username' => $fbUser->getName(),
                    'provider' => 'facebook',
                    'provider_id' => $fbUser->getId(),
                    'avatar' => $fbUser->getAvatar(),
                ]);
            } else {
                $user = User::create([
                    'email' => $fbUser->getEmail(),
                    'username' => $fbUser->getName(),
                    'provider' => 'facebook',
                    'provider_id' => $fbUser->getId(),
                    'avatar' => $fbUser->getAvatar(),
                    'password' => bcrypt(uniqid()), // password mặc định
                ]);
            }

            $this->assignDefaultRole($user);

            // Tạo JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'access_token' => $token,
                'token_type' => 'bearer',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi đăng nhập Facebook',
                'error' => $e->getMessage()
            ], 500);
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
            $defaultRole = Role::where('name', 'user')->first();
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
