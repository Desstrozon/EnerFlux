<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    //  Listar productos (GET /api/productos)
    public function index(Request $request)
    {
        $q = trim($request->query('q', ''));
        $query = Producto::query();

        if ($q !== '') {
            $query->where('nombre', 'like', "%{$q}%")
                  ->orWhere('descripcion', 'like', "%{$q}%")
                  ->orWhere('categoria', 'like', "%{$q}%");
        }

        return response()->json($query->orderBy('id_producto')->get());
    }

    //  Crear producto (POST /api/productos)
    public function store(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:150|unique:productos',
        'descripcion' => 'nullable|string',
        'categoria' => 'required|string|max:20',
        'precio_base' => 'required|numeric',
        'stock' => 'required|integer|min:0',
        'id_vendedor' => 'nullable|exists:users,id',
        'imagen' => 'nullable|image|max:2048'
    ]);

    if ($request->hasFile('imagen')) {
        $path = $request->file('imagen')->store('productos', 'public');
        $validated['imagen'] = $path;
    } else {
        $validated['imagen'] = 'default.png';
    }

    $producto = \App\Models\Producto::create($validated);

    return response()->json($producto, 201);
}


    //  Actualizar producto (PUT /api/productos/{id})
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:150|unique:productos,nombre,' . $producto->id_producto . ',id_producto',
            'descripcion' => 'nullable|string',
            'categoria' => 'sometimes|string|max:50',
            'precio_base' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'id_vendedor' => 'nullable|integer|exists:users,id',
            'imagen' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen'] = $path;
        }

        $producto->update($data);
        return response()->json($producto);
    }

    //  Eliminar producto (DELETE /api/productos/{id})
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }
        $producto->delete();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
