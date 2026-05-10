import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type TabType = "unpaid" | "paid" | "claimed";

export interface SalesEntry {
  id: number;
  status: TabType;
  name: string;
  service: string;
  amount: number;
  date: string;
  // Paid-specific fields
  paymentMethod?: string;
  // Claimed-specific fields
  classification?: string;
  washDate?: string;
}

interface SalesEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<SalesEntry, "id"> | SalesEntry) => void;
  entry?: SalesEntry | null;
  mode: "add" | "edit";
  tabType: TabType;
}

export function SalesEntryModal({ isOpen, onClose, onSave, entry, mode, tabType }: SalesEntryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    service: "WASH",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "CASH",
    classification: "REGULAR",
    washDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry && mode === "edit") {
      setFormData({
        name: entry.name,
        service: entry.service,
        amount: entry.amount.toString(),
        date: entry.date,
        paymentMethod: entry.paymentMethod || "CASH",
        classification: entry.classification || "REGULAR",
        washDate: entry.washDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        service: "WASH",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "CASH",
        classification: "REGULAR",
        washDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [entry, mode, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const entryData = {
      ...(mode === "edit" && entry ? { id: entry.id } : {}),
      name: formData.name.trim().toUpperCase(),
      service: formData.service,
      amount: parseFloat(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      classification: formData.classification,
      washDate: formData.washDate,
    };

    onSave(entryData as any);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[350px] max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e2e6]">
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[18px]">
            {mode === "add" ? "Add New Entry" : "Edit Entry"}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-0"
          >
            <X className="size-[24px]" color="#3878c2" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Customer Name */}
          <div className="mb-4">
            <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
              placeholder="JUAN DE LA CRUZ"
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Service */}
          <div className="mb-4">
            <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
              Service
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
            >
              <option value="WASH">WASH</option>
              <option value="DRY">DRY</option>
              <option value="FOLD">FOLD</option>
              <option value="WASH & DRY">WASH & DRY</option>
              <option value="WASH & FOLD">WASH & FOLD</option>
              <option value="FULL SERVICE">FULL SERVICE</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
              Amount (PHP)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-[10px] mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
            />
          </div>

          {/* Payment Method (if paid) */}
          {tabType === "paid" && (
            <div className="mb-4">
              <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
              >
                <option value="CASH">CASH</option>
                <option value="GCASH">GCASH</option>
                <option value="CARD">CARD</option>
                <option value="BANK TRANSFER">BANK TRANSFER</option>
              </select>
            </div>
          )}

          {/* Classification (if claimed) */}
          {tabType === "claimed" && (
            <div className="mb-4">
              <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
                Classification
              </label>
              <select
                value={formData.classification}
                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
              >
                <option value="REGULAR">REGULAR</option>
                <option value="VIP">VIP</option>
                <option value="MEMBER">MEMBER</option>
              </select>
            </div>
          )}

          {/* Wash Date (if claimed) */}
          {tabType === "claimed" && (
            <div className="mb-6">
              <label className="block font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px] mb-2">
                Wash Date
              </label>
              <input
                type="date"
                value={formData.washDate}
                onChange={(e) => setFormData({ ...formData, washDate: e.target.value })}
                className="w-full px-3 py-2 border border-[#bec1c6] rounded-[4px] text-[14px] focus:outline-none focus:border-[#3878c2]"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#e0e2e6] text-[#3a3e44] rounded-[4px] font-['Inter:Medium',sans-serif] text-[12px] border-none cursor-pointer hover:bg-[#d0d2d6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3878c2] text-white rounded-[4px] font-['Inter:Medium',sans-serif] text-[12px] border-none cursor-pointer hover:bg-[#2d6aa8]"
            >
              {mode === "add" ? "Add Entry" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}