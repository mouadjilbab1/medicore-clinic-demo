import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/translations';
import { Package, Plus, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PaginatedData } from '@/types';

interface Props {
    products: PaginatedData<any>;
    categoryFilter?: string;
    lowStockFilter?: boolean;
}

export default function InventoryIndex({ products, categoryFilter, lowStockFilter }: Props) {
    const { t } = useTranslation();
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [movementModalOpen, setMovementModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const productForm = useForm({
        name: '',
        sku: '',
        barcode: '',
        category: 'medication',
        unit: 'box',
        purchase_price: 50,
        selling_price: 80,
        current_stock: 50,
        minimum_stock_alert: 15,
    });

    const movementForm = useForm({
        movement_type: 'in',
        quantity: 10,
        notes: '',
    });

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        productForm.post(route('inventory.products.store'), {
            onSuccess: () => {
                setProductModalOpen(false);
                productForm.reset();
            },
        });
    };

    const handleMovementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        movementForm.post(route('inventory.movement', selectedProduct.id), {
            onSuccess: () => {
                setMovementModalOpen(false);
                movementForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pharmacy & Clinical Inventory - MediCore" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Package className="w-6 h-6 text-teal-600" />
                            <span>Pharmacy & Medical Consumables Inventory</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time stock levels, expiry tracking, reorder alerts, and consultation deductions
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                router.get(route('inventory.index'), {
                                    low_stock: lowStockFilter ? undefined : true,
                                });
                            }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                                lowStockFilter
                                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Low Stock Alerts</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setProductModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3.5 text-start font-semibold">SKU / Barcode</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Product Name</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Category</th>
                                    <th className="px-6 py-3.5 text-start font-semibold">Stock Level</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Purchase Price</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Selling Price</th>
                                    <th className="px-6 py-3.5 text-end font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No inventory items found.
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((prod) => {
                                        const isLow = prod.current_stock <= prod.minimum_stock_alert;
                                        return (
                                            <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                                                <td className="px-6 py-3.5 font-mono text-teal-800 font-bold">
                                                    {prod.sku}
                                                </td>
                                                <td className="px-6 py-3.5 font-semibold text-slate-900">
                                                    {prod.name}
                                                </td>
                                                <td className="px-6 py-3.5 capitalize text-slate-500">
                                                    {prod.category.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold font-mono text-sm text-slate-900">
                                                            {prod.current_stock} {prod.unit}
                                                        </span>
                                                        {isLow && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                                                                Low (min {prod.minimum_stock_alert})
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-end font-mono">{prod.purchase_price} MAD</td>
                                                <td className="px-6 py-3.5 text-end font-mono font-bold text-slate-900">
                                                    {prod.selling_price} MAD
                                                </td>
                                                <td className="px-6 py-3.5 text-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedProduct(prod);
                                                            setMovementModalOpen(true);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                                                    >
                                                        Stock Move ±
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {productModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-3">Add Product to Inventory</h3>
                        <form onSubmit={handleProductSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Product / Medication Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.data.name}
                                    onChange={(e) => productForm.setData('name', e.target.value)}
                                    placeholder="e.g. Paracetamol 500mg, Dental Syringe..."
                                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">SKU Code *</label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.data.sku}
                                        onChange={(e) => productForm.setData('sku', e.target.value)}
                                        placeholder="e.g. MED-PARA-500"
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                                    <select
                                        value={productForm.data.category}
                                        onChange={(e) => productForm.setData('category', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                    >
                                        <option value="medication">Pharmaceutical</option>
                                        <option value="disposable">Clinical Disposable</option>
                                        <option value="dental_material">Dental Material</option>
                                        <option value="equipment">Medical Equipment</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Purchase Price</label>
                                    <input
                                        type="number"
                                        value={productForm.data.purchase_price}
                                        onChange={(e) => productForm.setData('purchase_price', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Selling Price</label>
                                    <input
                                        type="number"
                                        value={productForm.data.selling_price}
                                        onChange={(e) => productForm.setData('selling_price', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                                    <input
                                        type="text"
                                        value={productForm.data.unit}
                                        onChange={(e) => productForm.setData('unit', e.target.value)}
                                        placeholder="box, vial, piece"
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Initial Stock Count</label>
                                    <input
                                        type="number"
                                        value={productForm.data.current_stock}
                                        onChange={(e) => productForm.setData('current_stock', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Low Stock Alert Threshold</label>
                                    <input
                                        type="number"
                                        value={productForm.data.minimum_stock_alert}
                                        onChange={(e) => productForm.setData('minimum_stock_alert', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setProductModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={productForm.processing}
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Enrol Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stock Movement Modal */}
            {movementModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-base mb-1">Stock Movement</h3>
                        <p className="text-xs text-slate-500 mb-4">{selectedProduct.name} (Current: {selectedProduct.current_stock} {selectedProduct.unit})</p>

                        <form onSubmit={handleMovementSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Action Type</label>
                                <select
                                    value={movementForm.data.movement_type}
                                    onChange={(e) => movementForm.setData('movement_type', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                >
                                    <option value="in">Stock Intake (Receive Supplier Delivery)</option>
                                    <option value="out">Stock Outflow (Damaged / Expired Removal)</option>
                                    <option value="consultation">Clinical Consumption in Consultation</option>
                                    <option value="adjustment">Audit Inventory Adjustment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={movementForm.data.quantity}
                                    onChange={(e) => movementForm.setData('quantity', Number(e.target.value))}
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                                <input
                                    type="text"
                                    value={movementForm.data.notes}
                                    onChange={(e) => movementForm.setData('notes', e.target.value)}
                                    placeholder="Invoice #, damaged seal, etc..."
                                    className="w-full p-2 border border-slate-300 rounded-xl outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setMovementModalOpen(false)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
                                >
                                    Confirm Movement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
