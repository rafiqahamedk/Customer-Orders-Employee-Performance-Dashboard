import React, { useEffect, useState } from "react";
import { Plus, ShoppingCart, ChevronRight } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import OrderTable from "../components/orders/OrderTable";
import OrderModal from "../components/orders/OrderModal";

export default function OrdersPage() {
  const { orders, fetchOrders, deleteOrder } = useOrderStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => { fetchOrders("all"); }, []);

  const handleEdit = (order) => { setEditOrder(order); setModalOpen(true); };
  const handleDelete = async (order) => {
    if (window.confirm(`Delete order for ${order.firstName} ${order.lastName}?`)) {
      await deleteOrder(order._id);
    }
  };
  const handleClose = () => { setModalOpen(false); setEditOrder(null); };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Customer Orders</h1>
          <p className="text-sm text-muted mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
        >
          <Plus size={15} /> Create Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-white dark:bg-[#161b27] rounded-2xl border-2 border-dashed border-border dark:border-[#1e2535] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-dark dark:text-white">No orders yet</p>
            <p className="text-sm text-muted mt-1">Create your first customer order</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all"
          >
            <Plus size={15} /> Create Order
          </button>
        </div>
      ) : (
        <>
          <OrderTable orders={orders} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Recent Orders */}
          <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-[#1e2535]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-primary" />
                <h3 className="font-semibold text-sm text-dark dark:text-white">Recent Orders</h3>
              </div>
              <span className="text-xs text-muted">Last {recentOrders.length} orders</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-bg dark:bg-white/5 text-muted">
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Product</th>
                    <th className="text-right px-4 py-3 font-medium">Qty</th>
                    <th className="text-right px-4 py-3 font-medium">Amount</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="border-t border-border dark:border-[#1e2535] hover:bg-bg dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 font-medium text-dark dark:text-white">{o.firstName} {o.lastName}</td>
                      <td className="px-4 py-3 text-muted max-w-[180px] truncate">{o.product}</td>
                      <td className="px-4 py-3 text-right text-dark dark:text-white">{o.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-dark dark:text-white">${o.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                          ${o.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" :
                            o.status === "In progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{new Date(o.orderDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modalOpen && <OrderModal order={editOrder} onClose={handleClose} />}
    </div>
  );
}
