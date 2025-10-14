<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function index(Request $request)
{
    $q = trim((string) $request->query('q', ''));
    $res = \App\Models\User::select('id','name','email','rol')
        ->when($q !== '', function ($query) use ($q) {
            $like = "%{$q}%";
            $query->where(function ($w) use ($like, $q) {
                // 🔍 Buscamos por nombre, email, rol o ID (exacto o parcial)
                $w->where('name', 'like', $like)
                  ->orWhere('email', 'like', $like)
                  ->orWhere('rol', 'like', $like);

                // Si lo que escribe el usuario es numérico, buscamos también por ID
                if (is_numeric($q)) {
                    $w->orWhere('id', (int)$q);
                }
            });
        })
        ->orderBy('id','asc')
        ->get();

    return response()->json($res);
}


public function vendedores(Request $request)
{
    $q = trim((string) $request->query('q', ''));
    $res = \App\Models\User::where('rol', 'vendedor')
        ->select('id','name','email')
        ->when($q !== '', function ($query) use ($q) {
            $like = "%{$q}%";
            $query->where(function ($w) use ($like, $q) {
                $w->where('name','like',$like)
                  ->orWhere('email','like',$like);
                if (is_numeric($q)) {
                    $w->orWhere('id', (int)$q);
                }
            });
        })
        ->orderBy('id','asc')
        ->get();

    return response()->json($res);
}


    // PUT /api/users/{id} (opcional)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|max:255',
            'rol'      => 'sometimes|string|max:50',
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'Usuario actualizado correctamente']);
    }

    // DELETE /api/users/{id} (opcional)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
