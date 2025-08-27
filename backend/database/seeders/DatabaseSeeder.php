<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GerenciaSeeder::class,
            MetodoPagoSeeder::class
            // Otros seeders que quieras ejecutar
        ]);

        User::factory()->create([
            'name' => 'Moises Castillo',
            'email' => 'moicastillo@mercal.gob.ve',
            'password' => bcrypt('12345678'),
            'id_gerencia' => '22'
        ]);
        User::factory()->create([
            'name' => 'Luis Navarro',
            'email' => 'lnavarro@mercal.gob.ve',
            'password' => bcrypt('12345678'),
            'id_gerencia' => '22'
        ]);
        User::factory()->create([
            'name' => 'Danyerbert Rangel',
            'email' => 'danrangel@mercal.gob.ve',
            'password' => bcrypt('12345678'),
            'id_gerencia' => '22'
        ]);
    }
}
