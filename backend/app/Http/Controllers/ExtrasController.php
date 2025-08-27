<?php

namespace App\Http\Controllers;

use App\Models\extras;
use App\Http\Requests\StoreextrasRequest;
use App\Http\Requests\BlukStoreExtrasRequest;
use App\Http\Requests\UpdateextrasRequest;
use App\Http\Resources\extrasResource;
use Arr;

class ExtrasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return extras::all();
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
    public function store(StoreextrasRequest $request)
    {
        return new extrasResource(extras::create($request->all()));
    }

    public function blukStore(BlukStoreExtrasRequest $request){
        $bluk = collect($request->all())->map(function($arr, $key){
            return Arr::except($arr, ['nombreExtra', 'precioExtra']);
        });
        extras::insert($bluk->toArray());
    }
    /**
     * Display the specified resource.
     */
    public function show(extras $extras)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(extras $extras)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateextrasRequest $request, extras $extras)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(extras $extras)
    {
        //
    }
}
