import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, Send, Check, X, Home, History, TrendingUp, Package, Settings, LogOut } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  stock: string;
  level: number;
  status: "HEALTHY" | "LOW STOCK";
}

const inventoryItems: InventoryItem[] = [
  { id: 1, name: "Detergent Powder", stock: "15 kg in stock", level: 75, status: "HEALTHY" },
  { id: 2, name: "Liquid Softener", stock: "4 L in stock", level: 20, status: "LOW STOCK" },
  { id: 3, name: "Fabric Softener", stock: "12 L in stock", level: 60, status: "HEALTHY" },
  { id: 4, name: "Laundry Bags", stock: "45 pcs in stock", level: 90, status: "HEALTHY" },
];

export function StaffInventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("inventory");
  const [showNotification, setShowNotification] = useState(false);
  const [notifiedItem, setNotifiedItem] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/staff-dashboard");
    else if (tab === "sales") navigate("/staff-sales-report");
    else if (tab === "history") navigate("/staff-history");
    else if (tab === "profile") navigate("/staff-profile");
  };

  const handleMenuNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleNotifyAdmin = (itemName: string) => {
    setNotifiedItem(itemName);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status: string) => {
    if (status === "HEALTHY") return "bg-[#4BAD40]/10 text-[#4BAD40]";
    if (status === "LOW STOCK") return "bg-[#EF4444]/10 text-[#EF4444]";
    return "";
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
          {/* Side Menu Drawer */}
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Drawer */}
              <div className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.15)] z-50 animate-slideInRight">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] px-6 pt-12 pb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-['Poppins:Bold',sans-serif] text-[24px] border-2 border-white">
                      S
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 bg-white/10 rounded-lg border-none cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <h2 className="font-['Poppins:SemiBold',sans-serif] text-white text-[20px] mb-1">
                    User
                  </h2>
                  <p className="font-['Poppins:Regular',sans-serif] text-white/80 text-[14px]">
                    Staff
                  </p>
                </div>

                {/* Menu Items */}
                <div className="px-4 py-6">
                  <div className="space-y-2 mb-6">
                    <button
                      onClick={() => handleMenuNavigate("/staff-dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <Home className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Home
                      </span>
                    </button>

                    <button
                      onClick={() => handleMenuNavigate("/staff-notifications")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <Bell className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Notifications
                      </span>
                    </button>

                    <button
                      onClick={() => handleMenuNavigate("/staff-history")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <History className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        History
                      </span>
                    </button>

                    <button
                      onClick={() => handleMenuNavigate("/staff-sales-report")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Sales Report
                      </span>
                    </button>

                    <button
                      onClick={() => handleMenuNavigate("/staff-inventory")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <Package className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Inventory
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4 mb-4">
                    <button
                      onClick={() => handleMenuNavigate("/staff-account-settings")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                    >
                      <Settings className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Settings
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EF4444]/10 border-none cursor-pointer hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-[#EF4444]" />
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[#EF4444] text-[14px]">
                      Log Out
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Toast Notification */}
          {showNotification && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#1e1e1e] text-white px-6 py-3 rounded-[16px] shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
              <Check className="w-5 h-5 text-[#4BAD40]" />
              <p className="font-['Poppins:Medium',sans-serif] text-[14px]">
                Restock request for '{notifiedItem}' sent to Admin!
              </p>
            </div>
          )}

          {/* Header */}
          <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              {/* Left: Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3878c2] to-[#20a9ea] flex items-center justify-center text-white font-['Poppins:SemiBold',sans-serif] text-[18px]">
                U
              </div>

              {/* Right: Notification and Menu */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/staff-notifications")}
                  className="relative p-2 bg-transparent border-none cursor-pointer"
                >
                  <Bell className="w-6 h-6 text-[#3878c2]" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 bg-transparent border-none cursor-pointer"
                >
                  <Menu className="w-6 h-6 text-[#3878c2]" />
                </button>
              </div>
            </div>

            {/* Welcome Text */}
            <div>
              <p className="font-['Poppins:Regular',sans-serif] text-[#3878c2]/70 text-[15px] mb-1">
                Welcome back, User
              </p>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[28px] mb-2">
                Inventory Stock
              </h1>
              <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px]">
                *Staff access: View-only. Admin manages replenishment.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6 space-y-4">
            {/* Inventory Items */}
            {inventoryItems.map((item) => (
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
                      {item.stock}
                    </p>
                  </div>
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px] uppercase ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Progress Section */}
                <div className="mb-3">
                  <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[11px] mb-2 uppercase">
                    Current Level
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressColor(item.level)}`}
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] min-w-[45px] text-right">
                      {item.level}%
                    </span>
                  </div>
                </div>

                {/* Notify Button (only for low stock) */}
                {item.status === "LOW STOCK" && (
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
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </MobileContainer>
  );
}
