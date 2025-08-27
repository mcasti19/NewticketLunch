<?php

namespace Database\Seeders;

use App\Models\gerencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GerenciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar datos en la tabla 'gerencias'
      
        // Puedes agregar más gerencias según sea necesario
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE COMPRAS',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE FINANZAS',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE ADMINISTRACION',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE INFRAESTRUCTURA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE CONTROL DE CALIDAD',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA GENERAL DE GESTION INSTITUCIONAL',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE GESTION SOCIALISTA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE TRANSPORTE GENERAL',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA GENERAL DE GESTION ECONOMICA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE LOGISTICA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE SEGURIDAD INTEGRAL',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE MERCADEO Y VENTAS',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA GENERAL DE OPERACIONES E INSPECCION',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE PROYECTOS',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE CONTABILIDAD',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE SALUD',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'GERENCIA DE INSPECCION Y SEGUIMIENTO',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'OFICINA DE PLANIFICACION Y PRESUPUESTO',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'OFICINA DE GESTION COMUNICACIONAL',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'OFICINA DE GESTION HUMANA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'OFICINA DE ATENCION AL CIUDADANO',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'OFICINA DE TECNOLOGIA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'AUDITORIA INTERNA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'CONSULTORIA JURIDICA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'PRESIDENCIA',
        ]);
        gerencia::create([
            'nombre_gerencia' => 'ESCUELA DE FORMACION',
        ]);

    }
}
