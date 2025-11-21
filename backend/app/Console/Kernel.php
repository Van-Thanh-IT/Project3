<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\UserLog;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */

    // Tự động xóa log cũ 6 tháng
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {
            \App\Models\UserLog::where('created_at', '<', now()->subMonths(6))->delete();
        })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
