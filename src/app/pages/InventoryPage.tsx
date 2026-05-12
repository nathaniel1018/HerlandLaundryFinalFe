import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { SideMenu } from "../components/dashboard/SideMenu";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Bell, Menu, Edit2, Check, X, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

interface InventoryItem {
  id: string; // Changed to string to match Backend/Prisma
  name: string;
  currentValue: number;
  maxValue: number;
  levelPercentage: number;
  isLowStock: boolean;
  isEditing?: boolean;
  editValue?: number;
}

export function InventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("inventory");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestocking, setIsRestocking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- API CALLS ---

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      // Initialize editing states
      const formattedData = data.map((item: InventoryItem) => ({
        ...item,
        isEditing: false,
        editValue: item.currentValue
      }));
      setItems(formattedData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSave = async (id: string) => {
    const itemToUpdate = items.find(i => i.id === id);
    if (!itemToUpdate) return;

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/inventory/${id}/restock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentValue: itemToUpdate.editValue }),
      });

      if (response.ok) {
        setSuccessMessage(`${itemToUpdate.name} updated successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchInventory(); // Refresh list
      }
    } catch (err) {
      alert("Failed to update item");
    }
  };

  const handleConfirmRestock = async () => {
    setShowConfirmModal(false);
    setIsRestocking(true);
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/inventory/restock-all-low", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setSuccessMessage("All low stock items restocked and staff notified!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        fetchInventory();
      }
    } catch (err) {
      alert("Error during mass restock");
    } finally {
      setIsRestocking(false);
    }
  };

  // --- UI HELPERS ---

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

  const toggleEdit = (id: string, isEditing: boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isEditing, editValue: item.currentValue } : item
    ));
  };

  const handleEditValueChange = (id: string, value: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, editValue: value } : item
    ));
  };

  return (
    <MobileContainer>
      <div className="relative h-screen overflow-y-auto bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        <div className="pb-24">
          
          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#4BAD40] text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
              <Check className="w-5 h-5 flex-shrink-0" />
              <p className="font-['Poppins:Medium',sans-serif] text-[13px]">{successMessage}</p>
            </div>
          )}

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowConfirmModal(false)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] shadow-lg z-50 w-full max-w-[340px] p-6 animate-slideUp">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[20px] mb-3">Restock All Low Items?</h2>
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px] mb-6">This will reset all items below 20% to their maximum capacity.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-white border-2 border-[#E5E7EB] h-[44px] rounded-[12px] text-[#757575]">Cancel</button>
                  <button onClick={handleConfirmRestock} className="flex-1 bg-gradient-to-r from-[#20a9ea] to-[#006c9f] h-[44px] rounded-[12px] text-white">Confirm</button>
                </div>
              </div>
            </>
          )}

          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => navigate("/login")} />
          
          <DashboardHeader 
            userName="User" 
            onNotificationClick={() => navigate("/notifications")} 
            onMenuClick={() => setIsMenuOpen(true)} 
            onAvatarClick={() => navigate("/profile")} 
            notificationCount={3} 
          />

          <div className="px-6 py-6">
            <div className="bg-white rounded-[20px] shadow-sm p-5 mb-6">
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[18px] mb-4">Inventory Items</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#3878c2]" /></div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-b-0">
                      <div className="flex-1">
                        <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">{item.name}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-center">
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.editValue}
                            onChange={(e) => handleEditValueChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border-2 border-[#3878c2] rounded-lg text-center text-[14px] outline-none"
                          />
                        ) : (
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getLevelBgColor(item.levelPercentage)}`}>
                            {item.isLowStock && <AlertTriangle className={`w-4 h-4 ${getLevelColor(item.levelPercentage)}`} />}
                            <span className={`font-['Poppins:SemiBold',sans-serif] text-[14px] ${getLevelColor(item.levelPercentage)}`}>
                              {item.levelPercentage}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isEditing ? (
                          <>
                            <button onClick={() => handleSave(item.id)} className="p-1.5 bg-[#4BAD40] rounded-lg border-none cursor-pointer"><Check className="w-4 h-4 text-white" /></button>
                            <button onClick={() => toggleEdit(item.id, false)} className="p-1.5 bg-[#EF4444] rounded-lg border-none cursor-pointer"><X className="w-4 h-4 text-white" /></button>
                          </>
                        ) : (
                          <button onClick={() => toggleEdit(item.id, true)} className="p-1.5 bg-[#3878c2]/10 rounded-lg border-none cursor-pointer"><Edit2 className="w-4 h-4 text-[#3878c2]" /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={fetchInventory} className="w-full bg-white border-2 border-[#3878c2] h-[48px] rounded-[24px] flex items-center justify-center gap-2 text-[#3878c2] font-semibold">
                <RefreshCw className="w-5 h-5" /> Refresh List
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!items.some(i => i.isLowStock) || isRestocking}
                className={`w-full h-[48px] rounded-[24px] flex items-center justify-center gap-2 border-none transition-all ${
                  !items.some(i => i.isLowStock) || isRestocking ? "bg-[#E5E7EB] cursor-not-allowed text-[#757575]" : "bg-gradient-to-r from-[#20a9ea] to-[#006c9f] text-white shadow-md"
                }`}
              >
                {isRestocking ? <Loader2 className="animate-spin" /> : "Restock All Low"}
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={(tab) => {
           setActiveTab(tab);
           if (tab === "home") navigate("/dashboard");
           else if (tab === "sales") navigate("/sales-report");
           else if (tab === "history") navigate("/history");
           else if (tab === "profile") navigate("/profile");
        }} />
      </div>
    </MobileContainer>
  );
}