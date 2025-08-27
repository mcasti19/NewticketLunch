<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->id('id_pedido');
            $table->integer('numero_pedido')->unsigned()->unique();
            $table->bigInteger('metodo_pago_id')->unsigned();
            $table->integer('referencia')->unsigned()->unique();
            $table->string('monto_total');
            $table->bigInteger('id_menu')->unsigned();
            $table->bigInteger('id_empleado')->unsigned();
            $table->timestamps();

            $table->foreign('metodo_pago_id')->references('id_metodo_pago')->on('metodo_pagos')->onDelete('cascade');
            $table->foreign('id_menu')->references('id_menu')->on('menuses')->onDelete('cascade');
            $table->foreign('id_empleado')->references('id_empleados')->on('empleados')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
