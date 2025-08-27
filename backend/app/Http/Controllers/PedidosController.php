<?php

namespace App\Http\Controllers;

use App\Models\pedidos;
use App\Http\Requests\StorepedidosRequest;
use App\Http\Requests\BlukStorePedidosRequest;
use App\Http\Requests\UpdatepedidosRequest;
use App\Http\Resources\pedidosResource;
use Arr;
use Illuminate\Http\Request;

class PedidosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        //return pedidos::all();
        $validated = $request->validate([
            'empleado' => 'nullable|integer|exists:empleados,id_empleados',
            'metodoPago' => 'nullable|integer|exists:metodo_pagos,id_metodo_pago',
            'menu' => 'nullable|integer|exists:menuses,id_menu',
        ]);
        $query = pedidos::with(['metodoPago', 'menu', 'empleado']);
        if (!empty($validated['empleado'])) {
            $query->where('id_empleado', $validated['empleado']);
        }
        if (!empty($validated['metodopago'])) {
            $query->where('metodo_pago_id', $validated['metodoPago']);
        }
        if (!empty($validated['menu'])) {
            $query->where('id_menu', $validated['menu']);
        }

        //dd($query);
        return response()->json([
            'success' => true,
            'data' => $query->paginate(15)
        ]);
    }
    public function store(StorepedidosRequest $request)
    {
        return new pedidosResource(pedidos::create($request->all()));
    }

    public function blukStore(BlukStorePedidosRequest $request){
        $bluk = collect($request->all())->map(function($arr,$key){
            return Arr::except($arr, ['numeroPedido', 'metodoPagoId', 'montoTotal', 'idMenu', 'idEmpleado']);
        });
         // Supongamos que 'numEmpleado' es el campo clave para evitar duplicados
        $incomingNumPedido = $bluk->pluck('numero_pedido')->filter()->unique();

        // Obtener los numEmpleado ya existentes en base de datos
        $existingNumPedido = Pedidos::whereIn('numero_pedido', $incomingNumPedido)->pluck('numero_pedido')->toArray();

        // Filtrar los registros que NO existan en la base de datos
        $uniqueBulk = $bluk->filter(function ($item) use ($existingNumPedido) {
            return !in_array($item['numero_pedido'], $existingNumPedido);
        });

        if ($uniqueBulk->isEmpty()) {
            return response()->json([
                'message' => 'No hay registros nuevos para insertar. Todos los registros ya existen.'
            ], 200);
        }
        pedidos::insert($uniqueBulk->values()->toArray());
        return response()->json([
            'message' => 'Registros insertados correctamente.',
            'inserted_count' => $uniqueBulk->count(),
            'skipped_count' => $bluk->count() - $uniqueBulk->count(),
            'skipped_registros' => $bluk->filter(function ($item) use ($existingNumPedido) {
                return in_array($item['numero_pedido'], $existingNumPedido);
            })->values()
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $registro = pedidos::where('id_pedido', $id)->first();
        if (!$registro) {
            return response()->json([
                'status' => 404,
                'message' => 'Error al encontrar el pedido'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $registro
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(pedidos $pedidos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepedidosRequest $request, pedidos $pedidos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pedidos $pedidos)
    {
        //
    }
}
