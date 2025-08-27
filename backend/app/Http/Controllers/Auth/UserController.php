<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\gerencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //Endpoint para el inicio de sessión.

    public function login(Request $request){
        try {
            //Validamos los campos
            $validation = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string|min:8',
            ]);
            if ($validation->fails()) {
                return response()->json([
                    'status' => 400,
                    'data' => $validation->messages() 
                ], 400);
            }else {
                //Verificar los datos del usuario
                if (Auth::attempt([
                    'email' => $request->email,
                    'password' => $request->password
                ])) {
                    //Traer los datos del usuario
                    $usuario = User::with('gerencia')->where('email', $request->email)->first();
                    return response()->json([
                        'status' => 200,
                        'data' => $usuario,
                        'token' => $usuario->createToken('api-key')->plainTextToken
                    ], 200);
                }else {
                    return response()->json([
                    'status' => 401,
                    'data' => 'Usuario no encontrado'
                ], 400);
                }
            }
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        $users = User::with('gerencia')->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
    public function store(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'id_gerencia' => 'nullable|integer|exists:gerencias,id_gerencia',
            ]);
            //Si la validación no se cumple
            if ($validation->fails()) {
                return response()->json([
                    'status' => 400,
                    'data' => $validation->messages() 
                ], 400);
            }else {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'id_gerencia' => $request->id_gerencia,
                ]);
                return response()->json([
                    'status' => 201,
                    'data' => $user,
                    'token' => $user->createToken('api-key')->plainTextToken
                ], 201);
            }

        } catch (\Throwable $th) {
           return response()->json($th->getMessage(), 500);
        }
    }
    public function show($id){
        $registro = User::where('id',$id)->first();
        if (!$registro) {
            return response()->json(['Error' => 'Erro al encontrar usuario'], 404);
        }
        return response()->json($registro, 200);
    }
    public function destroy($id){
        $registro = User::where('id', $id)->delete();
        if (!$registro) {
            return response()->json(['Error' => 'Erro al eliminar usuario'], 404);
        }
        return response()->json($registro, 200);
    }

}
