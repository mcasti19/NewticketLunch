<?php

use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\EmpleadosController;
use App\Http\Controllers\ExtrasController;
use App\Http\Controllers\GerenciaController;
use App\Http\Controllers\MenusController;
use App\Http\Controllers\MetodoPagoController;
use App\Http\Controllers\PedidosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function(){
    Route::group(['prefix' => 'p1', 'namespace' => 'App\Http\Controllers'], function (){
        Route::apiResource('gerencias', GerenciaController::class);
        Route::apiResource('metodosPagos', MetodoPagoController::class);
        Route::apiResource('menus', MenusController::class);
        Route::apiResource('extras', ExtrasController::class);
        Route::apiResource('empleados', EmpleadosController::class);
        Route::apiResource('pedidos', PedidosController::class);
        Route::apiResource('users', UserController::class);
        Route::post('extras/bluk', ['uses' => 'ExtrasController@blukStore']);
        Route::post('empleados/bluk', ['uses' => 'EmpleadosController@blukStore']);
        Route::post('pedidos/bluk', ['uses' => 'PedidosController@blukStore']);
    });
});

Route::group(['prefix' => 'p1', 'namespace' => 'App\Http\Controllers'], function (){
    Route::post('users/login', [UserController::class, 'login']);
});
