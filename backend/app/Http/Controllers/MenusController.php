<?php

namespace App\Http\Controllers;

use App\Models\menus;
use App\Http\Requests\StoremenusRequest;
use App\Http\Requests\UpdatemenusRequest;
use App\Http\Resources\menusResource;

class MenusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = menus::all();
        if ($menus->isEmpty()) {
            # code...
            return response()->json([
                'status' => 404,
                'message' => 'No se encontraron registros'  
            ], 404);
        }else {
            return response()->json([
                'success' => true,
                'data' => $menus  
            ]);
        }
    }
    public function store(StoremenusRequest $request)
    {

        return new menusResource(menus::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $registro = menus::where('id_menu',$id)->first();
        if (!$registro) {
            return response()->json([
                'status' => 404,
                'message' => 'Error al encontrar el menu.'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $registro
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(menus $menus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatemenusRequest $request, menus $menus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $registro = menus::where('id_menu', $id)->delete();
        if (!$registro) {
            return response()->json(['Error' => 'Error al eliminar menu'], 404);
        }
        return response()->json([
            'status' => 200,
            'message' => 'Menu eliminado correctamente' 
        ], 200);
    }
}
