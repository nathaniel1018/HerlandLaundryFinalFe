import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, Calendar, Settings, LogOut, ChevronRight, X, Home, History, TrendingUp, Package } from "lucide-react";

export function StaffProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/staff-dashboard");
    else if (tab === "sales") navigate("/staff-sales-report");
    else if (tab === "history") navigate("/staff-history");
    else if (tab === "inventory") navigate("/staff-inventory");
  };

  const handleMenuNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/login");
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

          {/* Header */}
          <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
            <div className="flex items-center justify-between">
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
          </div>

          {/* Main Profile Card */}
          <div className="px-6 py-8 flex justify-center">
            <div className="w-full max-w-[360px] bg-white rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Blue Header Background */}
              <div className="bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[100px] relative">
                {/* Overlapping Avatar */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3878c2] to-[#20a9ea] flex items-center justify-center text-white font-['Poppins:Bold',sans-serif] text-[32px] border-4 border-white shadow-lg">
                    S
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6">
                {/* Name */}
                <h2 className="font-['Poppins:Bold',sans-serif] text-[#1e1e1e] text-[20px] text-center mb-2">
                  STAFF_MEMBER_01
                </h2>

                {/* Status Badge */}
                <div className="flex justify-center mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#3878c2]/10 text-[#3878c2] font-['Poppins:SemiBold',sans-serif] text-[12px] uppercase">
                    On-Duty
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <p className="font-['Poppins:Bold',sans-serif] text-[#1e1e1e] text-[36px] mb-1">
                      152
                    </p>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[13px] uppercase tracking-wider">
                      Shifts
                    </p>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="space-y-3 mb-6">
                  {/* Duty Schedule */}
                  <button
                    onClick={() => navigate("/staff-duty-schedule")}
                    className="w-full bg-[#F9FAFB] rounded-[16px] px-5 py-4 flex items-center justify-between border-none cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] uppercase">
                        Duty Schedule
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#757575]" />
                  </button>

                  {/* Account Settings */}
                  <button
                    onClick={() => navigate("/staff-account-settings")}
                    className="w-full bg-[#F9FAFB] rounded-[16px] px-5 py-4 flex items-center justify-between border-none cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-[#3878c2]" />
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] uppercase">
                        Account Settings
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#757575]" />
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#EF4444] rounded-[16px] h-[48px] flex items-center justify-center gap-2 border-none cursor-pointer hover:bg-[#DC2626] transition-colors shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                >
                  <LogOut className="w-5 h-5 text-white" />
                  <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[14px] uppercase tracking-[0.5px]">
                    Logout Account
                  </span>
                </button>
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
