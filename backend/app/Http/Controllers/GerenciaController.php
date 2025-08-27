<?php

namespace App\Http\Controllers;

use App\Models\gerencia;
use App\Http\Requests\StoregerenciaRequest;
use App\Http\Requests\UpdategerenciaRequest;
use App\Policies\GerenciaPolicy;
use Request;

class GerenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
         try {
            // Obtener todos los registros de gerencia
            $gerencias = Gerencia::all();
            // Devolver respuesta JSON con código 200 (OK)
            return response()->json([
                'success' => true,
                'data' => $gerencias,
                'message' => 'Datos obtenidos correctamente'
            ], 200);
        
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoregerenciaRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $registro = gerencia::where('id_gerencia', $id)->first();
        if (!$registro) {
            return response()->json(['Error' => 'Registro no encontrado'], 404);
        }
        return response()->json($registro, 200);   
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(gerencia $gerencia)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdategerenciaRequest $request, gerencia $gerencia)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(gerencia $gerencia)
    {
        //
    }
}
