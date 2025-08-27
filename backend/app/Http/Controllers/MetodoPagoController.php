<?php

namespace App\Http\Controllers;

use App\Models\metodoPago;
use App\Http\Requests\StoremetodoPagoRequest;
use App\Http\Requests\UpdatemetodoPagoRequest;

class MetodoPagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return metodoPago::all();
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
    public function store(StoremetodoPagoRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $registro = metodoPago::where('id_metodo_pago', $id)->first();
        if (!$registro) {
            return response()->json(['Error' => 'Registro no encontrado'], 404);
        }

        return response()->json($registro, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(metodoPago $metodoPago)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatemetodoPagoRequest $request, metodoPago $metodoPago)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $registro = metodoPago::where('id_metodo_pago', $id)->delete();
        if (!$registro) {
            return response()->json(['Error' => 'Error al eliminar el metodo de pago'], 404);
        }
        return response()->json($registro, 200);
    }
}
