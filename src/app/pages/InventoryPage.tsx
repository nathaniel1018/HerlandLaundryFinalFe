import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, Edit2, Check, X, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  level: number;
  isEditing: boolean;
  editValue: number;
}

export function InventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("inventory");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: "Detergent Powder", level: 85, isEditing: false, editValue: 85 },
    { id: 2, name: "Fabric Softener", level: 62, isEditing: false, editValue: 62 },
    { id: 3, name: "Bleach", level: 45, isEditing: false, editValue: 45 },
    { id: 4, name: "Laundry Bags", level: 25, isEditing: false, editValue: 25 },
    { id: 5, name: "Hangers", level: 15, isEditing: false, editValue: 15 },
    { id: 6, name: "Stain Remover", level: 8, isEditing: false, editValue: 8 },
  ]);

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/dashboard");
    else if (tab === "sales") navigate("/sales-report");
    else if (tab === "history") navigate("/history");
    else if (tab === "profile") navigate("/profile");
  };

  const getLevelColor = (level: number) => {
    if (level >= 60) return "text-[#4BAD40]";
    if (level >= 30) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  const getLevelBgColor = (level: number) => {
    if (level >= 60) return "bg-[#4BAD40]/10";
    if (level >= 30) return "bg-[#F59E0B]/10";
    return "bg-[#EF4444]/10";
  };

  const handleEdit = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isEditing: true } : item
    ));
  };

  const handleSave = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, level: item.editValue, isEditing: false } : item
    ));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, editValue: item.level, isEditing: false } : item
    ));
  };

  const handleEditValueChange = (id: number, value: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, editValue: value } : item
    ));
  };

  const handleRefresh = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const hasLowStockItems = () => {
    return items.some(item => item.level < 30);
  };

  const handleRestockAllClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRestock = () => {
    setShowConfirmModal(false);
    setIsRestocking(true);

    // Simulate restocking process
    setTimeout(() => {
      setItems(items.map(item =>
        item.level < 30 ? { ...item, level: 75 + Math.floor(Math.random() * 20), editValue: 75 + Math.floor(Math.random() * 20) } : item
      ));
      setIsRestocking(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 2000);
  };

  return (
    <MobileContainer>
      <div className="relative h-screen overflow-y-auto bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        <div className="pb-24">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#4BAD40] text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p className="font-['Poppins:Medium',sans-serif] text-[14px]">
              All low stock items have been restocked and staff has been notified
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowConfirmModal(false)}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 w-full max-w-[340px] mx-4 p-6 animate-slideUp">
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[20px] mb-3">
                Restock All Low Items?
              </h2>
              <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px] mb-6">
                This will update all low stock items and notify staff.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-white border-2 border-[#E5E7EB] h-[44px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-[#757575] text-[14px] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRestock}
                  className="flex-1 bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[44px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-white text-[14px] border-none cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)] transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}

        {/* Header */}
        <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3878c2] to-[#20a9ea] flex items-center justify-center text-white font-['Poppins:SemiBold',sans-serif] text-[18px]">
              U
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 bg-transparent border-none cursor-pointer"
              >
                <Bell className="w-6 h-6 text-[#3878c2]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
              <button className="p-2 bg-transparent border-none cursor-pointer">
                <Menu className="w-6 h-6 text-[#3878c2]" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[24px] mb-1">
              Welcome back, User
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[#3878c2]/70 text-[15px]">
              Inventory Stock
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Inventory Card */}
          <div className="bg-white rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-5 mb-6">
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[18px] mb-4">
              Inventory Items
            </h2>

            {/* Table */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-b-0"
                >
                  {/* Item Name */}
                  <div className="flex-1">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                      {item.name}
                    </p>
                  </div>

                  {/* Level */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {item.isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.editValue}
                        onChange={(e) => handleEditValueChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border-2 border-[#3878c2] rounded-lg text-center font-['Poppins:Medium',sans-serif] text-[14px] outline-none"
                      />
                    ) : (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-500 ${getLevelBgColor(item.level)}`}>
                        {item.level < 30 && (
                          <AlertTriangle className={`w-4 h-4 ${getLevelColor(item.level)}`} />
                        )}
                        <span className={`font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all duration-500 ${getLevelColor(item.level)}`}>
                          {item.level}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    {item.isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(item.id)}
                          className="p-1.5 bg-[#4BAD40] rounded-lg border-none cursor-pointer hover:bg-[#3d9932] transition-colors"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="p-1.5 bg-[#EF4444] rounded-lg border-none cursor-pointer hover:bg-[#DC2626] transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1.5 bg-[#3878c2]/10 rounded-lg border-none cursor-pointer hover:bg-[#3878c2]/20 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-[#3878c2]" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefresh}
              className="w-full bg-white border-2 border-[#3878c2] h-[48px] rounded-[24px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#3878c2]/5 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-[#3878c2]" />
              <span className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px]">
                Refresh List
              </span>
            </button>

            <div>
              <button
                onClick={handleRestockAllClick}
                disabled={!hasLowStockItems() || isRestocking}
                className={`w-full h-[48px] rounded-[24px] flex items-center justify-center gap-2 border-none transition-all ${
                  !hasLowStockItems() || isRestocking
                    ? "bg-[#E5E7EB] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] cursor-pointer shadow-[0_4px_12px_rgba(17,140,198,0.25)] hover:shadow-[0_6px_16px_rgba(17,140,198,0.35)]"
                }`}
              >
                {isRestocking ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[15px]">
                      Restocking...
                    </span>
                  </>
                ) : (
                  <span className={`font-['Poppins:SemiBold',sans-serif] text-[15px] ${
                    !hasLowStockItems() ? "text-[#757575]" : "text-white"
                  }`}>
                    Restock All Low
                  </span>
                )}
              </button>
              {!hasLowStockItems() && !isRestocking && (
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] text-center mt-2">
                  All items are sufficiently stocked
                </p>
              )}
              {hasLowStockItems() && !isRestocking && (
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[11px] text-center mt-2">
                  Staff will receive a notification about restocked items
                </p>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </MobileContainer>
  );
}
