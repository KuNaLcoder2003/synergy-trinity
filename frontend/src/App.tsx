import { useState } from "react";
import type { ActiveView, Customer, Order, Supplier } from "./types";
import { mockCustomers, mockSuppliers, mockOrders } from "./data/mockData";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import SupplierList from "./components/SupplierList";
import OrderList from "./components/OrderList";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  /* ── Customer CRUD ── */
  const addCustomer = (c: Customer) => setCustomers((p) => [...p, c]);
  const editCustomer = (c: Customer) =>
    setCustomers((p) => p.map((x) => (x._id === c._id ? c : x)));
  const deleteCustomer = (id: string) =>
    setCustomers((p) => p.filter((x) => x._id !== id));

  /* ── Supplier CRUD ── */
  const addSupplier = (s: Supplier) => setSuppliers((p) => [...p, s]);
  const editSupplier = (s: Supplier) =>
    setSuppliers((p) => p.map((x) => (x._id === s._id ? s : x)));
  const deleteSupplier = (id: string) =>
    setSuppliers((p) => p.filter((x) => x._id !== id));

  /* ── Order CRUD ── */
  const addOrder = (o: Order) => setOrders((p) => [...p, o]);
  const editOrder = (o: Order) =>
    setOrders((p) => p.map((x) => (x._id === o._id ? o : x)));
  const deleteOrder = (id: string) =>
    setOrders((p) => p.filter((x) => x._id !== id));
  const updateOrderDocs = (orderId: string, docs: Order["docs"]) =>
    setOrders((p) => p.map((o) => (o._id === orderId ? { ...o, docs } : o)));

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            orders={orders}
            customers={customers}
            suppliers={suppliers}
            onNavigate={(v) => setActiveView(v)}
          />
        );
      case "customers":
        return (
          <CustomerList
            customers={customers}
            onAdd={addCustomer}
            onEdit={editCustomer}
            onDelete={deleteCustomer}
          />
        );
      case "suppliers":
        return (
          <SupplierList
            suppliers={suppliers}
            onAdd={addSupplier}
            onEdit={editSupplier}
            onDelete={deleteSupplier}
          />
        );
      case "orders":
        return (
          <OrderList
            orders={orders}
            customers={customers}
            suppliers={suppliers}
            onAdd={addOrder}
            onEdit={editOrder}
            onDelete={deleteOrder}
            onUpdateDocs={updateOrderDocs}
          />
        );
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
        rel="stylesheet"
      />
      <Layout
        activeView={activeView}
        onNavigate={setActiveView}
        stats={{
          orders: orders.length,
          customers: customers.length,
          suppliers: suppliers.length,
        }}
      >
        {renderView()}
      </Layout>
    </>
  );
}