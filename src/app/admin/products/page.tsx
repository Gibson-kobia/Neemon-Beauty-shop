"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { DBProduct, CategorySlug } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const [formData, setFormData] = useState<Partial<DBProduct>>({
    category: "makeup",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: DBProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        category: "makeup",
        is_active: true,
        stock: 0,
        rating: 0,
        reviews_count: 0,
        brand: "Neemon",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = formData.slug || generateSlug(formData.name || "");
      const productData = {
        ...formData,
        slug,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
      }

      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      alert("Error saving product: " + (error as any).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product: DBProduct) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;
      // Optimistic update
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Product</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Category</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Price</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Stock</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      KES {Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`font-medium ${
                          product.stock < 10 ? "text-orange-600" : "text-gray-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Matte Lipstick"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={formData.brand || ""}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Maybelline"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category || "makeup"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="makeup">Makeup</option>
                    <option value="skincare">Skincare</option>
                    <option value="hair">Hair</option>
                    <option value="perfumes">Perfumes</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price (KES)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Product details..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
