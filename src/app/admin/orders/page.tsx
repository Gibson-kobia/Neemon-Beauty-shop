"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Order, OrderStatus } from "@/lib/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "NEW",
  "PREPARING",
  "WITH_RIDER",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filterStatus === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === filterStatus));
    }
  }, [filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      // 1. Update order status
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      // 2. Log change (optional)
      console.log(
        `SMS to customer ${selectedOrder.customer_phone}: Order #${selectedOrder.id.slice(
          0,
          8
        )} status changed to ${newStatus}`
      );

      // 3. Update local state
      const updatedOrder = { ...selectedOrder, status: newStatus };
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
      setSelectedOrder(updatedOrder);
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === "ALL"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Orders
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Order ID</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Customer</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Items</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Total</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      KES {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "NEW"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "PREPARING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "WITH_RIDER"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Status Control */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Order Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={updating}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedOrder.status === status
                          ? "bg-black text-white shadow-md"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-black"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Customer Details
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-900">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium text-gray-900">Phone:</span> {selectedOrder.customer_phone}</p>
                    <p><span className="font-medium text-gray-900">Email:</span> {selectedOrder.customer_email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Delivery Info
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-900">Method:</span> {selectedOrder.delivery_method}</p>
                    {/* Add address if available in future */}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                  Order Items
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 font-medium text-gray-600">Product</th>
                        <th className="px-4 py-2 font-medium text-gray-600 text-center">Qty</th>
                        {/* Add price if available in items JSON */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-gray-900">
                             {/* Assuming item has name, if not we only have productId */}
                             {item.name || `Product ID: ${item.productId}`}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {item.qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                        <td className="px-4 py-3 text-center font-bold text-gray-900">
                          KES {Number(selectedOrder.total).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
