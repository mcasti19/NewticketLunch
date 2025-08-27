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
        Schema::create('empleados', function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->id('id_empleados');
            $table->string('nombre_completo', 100);
            $table->string('cedula', 10)->unique();
            $table->bigInteger('id_gerencia')->unsigned();
            $table->string('estado', 70);
            $table->string('tipo_empleado', 100);
            $table->string('cargo', 100);
            $table->timestamps();


            $table->foreign('id_gerencia')->references('id_gerencia')->on('gerencias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
