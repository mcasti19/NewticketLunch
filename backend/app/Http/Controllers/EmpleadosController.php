<?php

namespace App\Http\Controllers;

use App\Models\empleados;
use App\Http\Requests\StoreempleadosRequest;
use App\Http\Requests\BlukStoreEmpleadosRequest;
use App\Http\Requests\UpdateempleadosRequest;
use App\Http\Resources\empleadosResource;
use Arr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EmpleadosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'gerencia' => 'nullable|integer|exists:gerencias,id_gerencia'
        ]);
        $query = empleados::query()->with('gerencia');
        if (!empty($validated['gerencia'])) {
            $query->where('id_gerencia', $validated['gerencia']);
        }
        return response()->json([
            'success' => true,
            'data' => $query->paginate(15)
        ]);
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
    public function store(StoreempleadosRequest $request)
    {
        return new empleadosResource(empleados::create($request->all()));
    }

    public function blukStore(BlukStoreEmpleadosRequest $request){
        $bluk = collect($request->all())->map(function($arr, $key){
            return Arr::except($arr, ['nombreCompleto', 'idGerencia', 'tipoEmpleado']);
        });
        empleados::insert($bluk->toArray());

        return response()->json([
            'status' => 200,
            'message' => 'Empleados insertados correctamente'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(empleados $empleados)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(empleados $empleados)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateempleadosRequest $request, empleados $empleados)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(empleados $empleados)
    {
        //
    }
}
