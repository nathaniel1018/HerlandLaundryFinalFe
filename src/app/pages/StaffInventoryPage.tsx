import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { SideMenu } from "../components/dashboard/SideMenu";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Bell, Menu, Send, Check, Loader2, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string; // UUID from backend
  name: string;
  currentValue: number;
  maxValue: number;
  levelPercentage: number;
  isLowStock: boolean;
  unit?: string; // Optional: e.g., "kg", "L", "pcs"
}

export function StaffInventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("inventory");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifiedItem, setNotifiedItem] = useState("");

  // --- API CALLS ---

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/staff-dashboard");
    else if (tab === "sales") navigate("/staff-sales-report");
    else if (tab === "history") navigate("/staff-history");
    else if (tab === "profile") navigate("/staff-profile");
  };

  const handleNotifyAdmin = (itemName: string) => {
    // Note: In a real production app, you might have a POST /inventory/request-restock
    // For now, we simulate the request success as per your current UI logic
    setNotifiedItem(itemName);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // --- UI HELPERS ---

  const getStatusStyles = (isLow: boolean) => {
    return isLow 
      ? "bg-[#EF4444]/10 text-[#EF4444]" 
      : "bg-[#4BAD40]/10 text-[#4BAD40]";
  };

  const getProgressColor = (level: number) => {
    if (level >= 60) return "bg-[#4BAD40]";
    if (level >= 30) return "bg-[#F59E0B]";
    return "bg-[#EF4444]";
  };

  return (
    <MobileContainer>
      <div className="relative h-screen overflow-y-auto bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        <div className="pb-24">
          
          <SideMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onLogout={() => navigate("/login")}
            isStaff={true} 
          />

          {/* Toast Notification */}
          {showNotification && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#1e1e1e] text-white px-6 py-3 rounded-[16px] shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
              <Check className="w-5 h-5 text-[#4BAD40]" />
              <p className="font-['Poppins:Medium',sans-serif] text-[13px]">
                Restock request for '{notifiedItem}' sent to Admin!
              </p>
            </div>
          )}

          {/* Header */}
          <DashboardHeader 
            userName="User" 
            onNotificationClick={() => navigate("/staff-notifications")}
            onMenuClick={() => setIsMenuOpen(true)}
            onAvatarClick={() => navigate("/staff-profile")}
            notificationCount={2}
          />

          <div className="bg-white px-6 pb-6 shadow-sm -mt-1">
             <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[28px] mb-1">
                Inventory Stock
              </h1>
              <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px]">
                *Staff access: View-only. Notify admin for replenishment.
              </p>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-[#3878c2] animate-spin" />
                <p className="text-[#3878c2] font-medium">Loading inventory...</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5"
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px] mb-1 uppercase">
                        {item.name}
                      </h3>
                      <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px]">
                        {item.currentValue} {item.unit || 'units'} in stock
                      </p>
                    </div>
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px] uppercase flex items-center gap-1 ${getStatusStyles(item.isLowStock)}`}>
                      {item.isLowStock && <AlertTriangle className="w-3 h-3" />}
                      {item.isLowStock ? "LOW STOCK" : "HEALTHY"}
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-3">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[11px] mb-2 uppercase opacity-60">
                      Current Level
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(item.levelPercentage)}`}
                          style={{ width: `${item.levelPercentage}%` }}
                        ></div>
                      </div>
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] min-w-[45px] text-right">
                        {item.levelPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Notify Button (only for low stock) */}
                  {item.isLowStock && (
                    <button
                      onClick={() => handleNotifyAdmin(item.name)}
                      className="w-full bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[44px] rounded-[22px] flex items-center justify-center gap-2 cursor-pointer border-none shadow-[0_4px_12px_rgba(17,140,198,0.25)] hover:shadow-[0_6px_16px_rgba(17,140,198,0.35)] transition-all mt-3"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[13px] uppercase tracking-[0.5px]">
                        Notify Admin for Restock
                      </span>
                    </button>
                  )}
                </div>
              ))
            )}
            
            {!isLoading && items.length === 0 && (
              <div className="text-center py-10 text-[#757575]">
                No inventory items found.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </MobileContainer>
  );
}