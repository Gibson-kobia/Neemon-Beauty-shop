"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { Order, DBProduct } from "@/lib/types";

type DashboardStats = {
  newOrders: number;
  salesToday: number;
  lowStock: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newOrders: 0,
    salesToday: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Get New Orders Count
        const { count: newOrdersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "NEW");

        // 2. Get Sales Today
        const { data: todayOrders } = await supabase
          .from("orders")
          .select("total")
          .gte("created_at", today.toISOString());

        const salesToday = todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

        // 3. Get Low Stock Products Count
        const { count: lowStockCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("stock", 10);

        // 4. Get Recent Orders
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          newOrders: newOrdersCount || 0,
          salesToday: salesToday,
          lowStock: lowStockCount || 0,
        });
        setRecentOrders(orders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Today: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Orders</p>
              <p className="text-3xl font-bold text-blue-600">{stats.newOrders}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600 text-xl">
              🛍️
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sales Today</p>
              <p className="text-3xl font-bold text-green-600">
                KES {stats.salesToday.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600 text-xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full text-orange-600 text-xl">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customer_name}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
