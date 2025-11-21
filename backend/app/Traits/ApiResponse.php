<?php

namespace App\Traits;

use Illuminate\Http\Response;

trait ApiResponse
{
    /**
     * Trả về response thành công (Success)
     */
    public function successResponse($data, $message = 'Thành công', $code = Response::HTTP_OK)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
        ], $code);
    }
    public function errorResponse($message, $code = Response::HTTP_BAD_REQUEST)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'data'    => null,
        ], $code);
    }
}