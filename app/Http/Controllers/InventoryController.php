<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\InventoryProduct;
use App\Models\InventoryMovement;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->input('category');
        $lowStockOnly = $request->boolean('low_stock');

        $query = InventoryProduct::with(['batches', 'movements.creator'])->orderBy('name');

        if ($category) {
            $query->where('category', $category);
        }

        if ($lowStockOnly) {
            $query->whereColumn('current_stock', '<=', 'minimum_stock_alert');
        }

        $products = $query->paginate(15)->withQueryString();

        return Inertia::render('Inventory/Index', [
            'products' => $products,
            'categoryFilter' => $category,
            'lowStockFilter' => $lowStockOnly,
        ]);
    }

    public function storeProduct(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:50', 'unique:inventory_products,sku'],
            'barcode' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'in:medication,disposable,dental_material,equipment,other'],
            'unit' => ['required', 'string', 'max:30'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'current_stock' => ['required', 'integer', 'min:0'],
            'minimum_stock_alert' => ['required', 'integer', 'min:0'],
        ]);

        $validated['branch_id'] = $request->user()?->branch_id ?? 1;

        $product = InventoryProduct::create($validated);

        if ($validated['current_stock'] > 0) {
            InventoryMovement::create([
                'product_id' => $product->id,
                'movement_type' => 'in',
                'quantity' => $validated['current_stock'],
                'notes' => 'Initial stock intake on item registration.',
                'created_by' => $request->user()?->id,
            ]);
        }

        return back()->with('success', "Item '{$product->name}' added to inventory.");
    }

    public function recordMovement(Request $request, int $id): RedirectResponse
    {
        $product = InventoryProduct::findOrFail($id);

        $validated = $request->validate([
            'movement_type' => ['required', 'in:in,out,adjustment,consultation'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $quantity = intval($validated['quantity']);

        if (in_array($validated['movement_type'], ['out', 'consultation'])) {
            if ($product->current_stock < $quantity) {
                return back()->withErrors(['quantity' => 'Insufficient stock for this deduction.']);
            }
            $product->decrement('current_stock', $quantity);
        } else {
            $product->increment('current_stock', $quantity);
        }

        InventoryMovement::create([
            'product_id' => $product->id,
            'movement_type' => $validated['movement_type'],
            'quantity' => $quantity,
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        return back()->with('success', "Stock movement recorded for '{$product->name}'.");
    }
}
