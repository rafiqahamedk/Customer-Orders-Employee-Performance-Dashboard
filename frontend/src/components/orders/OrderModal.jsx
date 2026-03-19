import React, { useState } from "react";
import { X } from "lucide-react";
import { useOrderStore } from "../../store/useOrderStore";

const EMPTY = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", city: "", state: "", postalCode: "", country: "",
  product: "", quantity: 1, unitPrice: "", status: "Pending", createdBy: "",
};
const REQUIRED = ["firstName","lastName","email","phone","street","city","state","postalCode","country","product","quantity","unitPrice","status","createdBy"];

const PRODUCTS = [
  "Fiber Internet 300 Mbps","5G Unlimited Mobile Plan","Fiber Internet 1 Gbps",
  "Business Internet 500 Mbps","VoIP Corporate Package",
];
const EMPLOYEES = [
  "Mr. Michael Harris","Mr. Ryan Cooper","Ms. Olivia Carter","Mr. Lucas Martin",
];
const COUNTRIES = ["United States","Canada","Australia","Singapore","Hong Kong"];

function Field({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-dark/80 dark:text-white/70">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}

const inputBase =
  "w-full px-3 py-2.5 text-sm bg-bg dark:bg-white/5 border rounded-xl outline-none transition-colors text-dark dark:text-white placeholder:text-muted";
const inputCls = (err) =>
  `${inputBase} ${err ? "border-red-400 focus:border-red-500" : "border-border dark:border-[#1e2535] focus:border-primary dark:focus:border-primary focus:bg-white dark:focus:bg-white/10"}`;
const selectCls = (err) =>
  `${inputBase} cursor-pointer ${err ? "border-red-400" : "border-border dark:border-[#1e2535] focus:border-primary dark:focus:border-primary"} dark:bg-[#0d1117]`;

export default function OrderModal({ order, onClose }) {
  const { createOrder, updateOrder } = useOrderStore();
  const [form, setForm] = useState(order ? {
    firstName: order.firstName, lastName: order.lastName, email: order.email,
    phone: order.phone, street: order.street, city: order.city,
    state: order.state, postalCode: order.postalCode, country: order.country,
    product: order.product, quantity: order.quantity, unitPrice: order.unitPrice,
    status: order.status, createdBy: order.createdBy,
  } : { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = (parseFloat(form.quantity) || 0) * (parseFloat(form.unitPrice) || 0);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs = {};
    REQUIRED.forEach((k) => { if (!form[k] && form[k] !== 0) errs[k] = "Required"; });
    if (form.quantity < 1) errs.quantity = "Min 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, totalAmount, quantity: +form.quantity, unitPrice: +form.unitPrice };
      if (order) await updateOrder(order._id, payload);
      else await createOrder(payload);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-[#1e2535] flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-dark dark:text-white">{order ? "Edit Order" : "Create Order"}</h2>
            <p className="text-xs text-muted mt-0.5">Fill in all required fields</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-bg dark:hover:bg-white/10 hover:text-dark dark:hover:text-white transition-all"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto scrollbar-thin flex-1">
          <div className="p-6 flex flex-col gap-6">

            {/* Customer Info */}
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Customer Information</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" required error={errors.firstName}>
                  <input className={inputCls(errors.firstName)} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                </Field>
                <Field label="Last name" required error={errors.lastName}>
                  <input className={inputCls(errors.lastName)} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                </Field>
                <Field label="Email address" required error={errors.email}>
                  <input className={inputCls(errors.email)} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
                <Field label="Phone number" required error={errors.phone}>
                  <input className={inputCls(errors.phone)} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Street address" required error={errors.street}>
                  <input className={inputCls(errors.street)} value={form.street} onChange={(e) => set("street", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="City" required error={errors.city}>
                  <input className={inputCls(errors.city)} value={form.city} onChange={(e) => set("city", e.target.value)} />
                </Field>
                <Field label="State / Province" required error={errors.state}>
                  <input className={inputCls(errors.state)} value={form.state} onChange={(e) => set("state", e.target.value)} />
                </Field>
                <Field label="Postal code" required error={errors.postalCode}>
                  <input className={inputCls(errors.postalCode)} value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
                </Field>
                <Field label="Country" required error={errors.country}>
                  <select className={selectCls(errors.country)} value={form.country} onChange={(e) => set("country", e.target.value)}>
                    <option value="">-- Select --</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Order Info */}
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Order Information</p>
              <Field label="Product" required error={errors.product}>
                <select className={selectCls(errors.product)} value={form.product} onChange={(e) => set("product", e.target.value)}>
                  <option value="">-- Select product --</option>
                  {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <Field label="Quantity" required error={errors.quantity}>
                  <input
                    className={inputCls(errors.quantity)}
                    type="number" min={1}
                    value={form.quantity}
                    onChange={(e) => set("quantity", Math.max(1, +e.target.value))}
                  />
                </Field>
                <Field label="Unit price" required error={errors.unitPrice}>
                  <input
                    className={inputCls(errors.unitPrice)}
                    type="number" min={0} step="0.01"
                    value={form.unitPrice}
                    onChange={(e) => set("unitPrice", e.target.value)}
                  />
                </Field>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-dark/80 dark:text-white/70">Total amount</label>
                  <input
                    className={`${inputBase} border border-border dark:border-[#1e2535] opacity-70 cursor-not-allowed`}
                    readOnly
                    value={`$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Status" required error={errors.status}>
                  <select className={selectCls(errors.status)} value={form.status} onChange={(e) => set("status", e.target.value)}>
                    <option>Pending</option>
                    <option>In progress</option>
                    <option>Completed</option>
                  </select>
                </Field>
                <Field label="Created by" required error={errors.createdBy}>
                  <select className={selectCls(errors.createdBy)} value={form.createdBy} onChange={(e) => set("createdBy", e.target.value)}>
                    <option value="">-- Select employee --</option>
                    {EMPLOYEES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-[#1e2535] bg-bg/50 dark:bg-white/[0.02] flex-shrink-0">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border dark:border-[#1e2535] text-sm text-muted hover:border-dark/30 dark:hover:border-white/20 hover:text-dark dark:hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-sm font-semibold shadow-md shadow-primary/25 transition-all"
            >
              {submitting ? "Saving..." : order ? "Update Order" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
