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
        Schema::create('menuses', function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->id('id_menu');
            $table->string('sopa', 80);
            $table->string('contour_one', 80);
            $table->string('contour_two', 80);
            $table->string('salad_one', 80);
            $table->string('salad_two', 80);
            $table->string('juice', 80);
            $table->string('dessert', 80);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menuses');
    }
};
