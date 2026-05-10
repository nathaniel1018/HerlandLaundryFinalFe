import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, ChevronDown, Check, X, Home, History, TrendingUp, Package, Settings, LogOut } from "lucide-react";

export function StaffDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("home");
  const [isWorkQueueExpanded, setIsWorkQueueExpanded] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [notifiedLoads, setNotifiedLoads] = useState<Set<string>>(new Set());
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "sales") navigate("/staff-sales-report");
    else if (tab === "history") navigate("/staff-history");
    else if (tab === "inventory") navigate("/staff-inventory");
    else if (tab === "profile") navigate("/staff-profile");
  };

  const handleNotifyClick = (loadId: string) => {
    setSelectedLoad(loadId);
    setShowConfirmModal(true);
  };

  const handleConfirmNotify = () => {
    setShowConfirmModal(false);
    setIsNotifying(true);

    // Simulate notification process
    setTimeout(() => {
      if (selectedLoad) {
        setNotifiedLoads(new Set([...notifiedLoads, selectedLoad]));
      }
      setIsNotifying(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1500);
  };

  const handleMenuNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <MobileContainer>
      <div className="relative h-screen overflow-y-auto bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        <div className="pb-24">
          {/* Success Toast */}
          {showSuccessToast && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#4BAD40] text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
              <Check className="w-5 h-5 flex-shrink-0" />
              <p className="font-['Poppins:Medium',sans-serif] text-[14px]">
                Customer has been notified successfully
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
                  Notify Customer?
                </h2>
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px] mb-6">
                  This will mark that the customer has been notified that their laundry is ready for pick-up.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 bg-white border-2 border-[#E5E7EB] h-[44px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-[#757575] text-[14px] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmNotify}
                    className="flex-1 bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[44px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-white text-[14px] border-none cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)] transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </>
          )}

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
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[28px]">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6 space-y-6">
          {/* SECTION 1: INVENTORY OVERVIEW */}
          <div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[18px] mb-4">
              Inventory Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Detergent Powder */}
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px] mb-2 uppercase">
                  Detergent Powder
                </p>
                <div className="bg-[#4BAD40]/10 rounded-full px-3 py-1 inline-block mb-2">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#4BAD40] text-[11px] uppercase">
                    Healthy
                  </span>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-3">
                  15 kg in stock
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[11px] mb-2 uppercase">
                  Current Level
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#4BAD40] h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[12px]">
                    85%
                  </span>
                </div>
              </div>

              {/* Card 2: Fabric Softener */}
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px] mb-2 uppercase">
                  Fabric Softener
                </p>
                <div className="bg-[#4BAD40]/10 rounded-full px-3 py-1 inline-block mb-2">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#4BAD40] text-[11px] uppercase">
                    Healthy
                  </span>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-3">
                  8 L in stock
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[11px] mb-2 uppercase">
                  Current Level
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#4BAD40] h-full rounded-full" style={{ width: "72%" }}></div>
                  </div>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[12px]">
                    72%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ACTIVE LOADS */}
          <div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[18px] mb-4">
              Active Loads
            </h2>
            <div className="space-y-3">
              {/* Load 1 */}
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px] mb-1">
                      LOAD #0101
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px]">
                      Regular Wash
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#3878c2] h-full rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <p className="font-['Poppins:Medium',sans-serif] text-[#3878c2] text-[13px]">
                  25 minutes remaining
                </p>
              </div>

              {/* Load 2 */}
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px] mb-1">
                      LOAD #0102
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px] mb-2">
                      Premium Wash
                    </p>
                    <div className={`rounded-full px-3 py-1 inline-block transition-all duration-300 ${
                      notifiedLoads.has("0102")
                        ? "bg-[#3878c2]/10"
                        : "bg-[#4BAD40]/10"
                    }`}>
                      <span className={`font-['Poppins:SemiBold',sans-serif] text-[12px] uppercase transition-all duration-300 ${
                        notifiedLoads.has("0102")
                          ? "text-[#3878c2]"
                          : "text-[#4BAD40]"
                      }`}>
                        {notifiedLoads.has("0102") ? "Customer Notified" : "Ready for Pick-up"}
                      </span>
                    </div>
                    {notifiedLoads.has("0102") && (
                      <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[11px] mt-2">
                        Customer was notified manually
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleNotifyClick("0102")}
                  disabled={notifiedLoads.has("0102") || isNotifying}
                  className={`w-full h-[44px] rounded-[22px] flex items-center justify-center border-none transition-all mt-3 ${
                    notifiedLoads.has("0102")
                      ? "bg-[#E5E7EB] cursor-not-allowed"
                      : isNotifying
                      ? "bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] cursor-wait"
                      : "bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] cursor-pointer shadow-[0_4px_12px_rgba(17,140,198,0.25)] hover:shadow-[0_6px_16px_rgba(17,140,198,0.35)]"
                  }`}
                >
                  <span className={`font-['Poppins:SemiBold',sans-serif] text-[14px] uppercase tracking-[0.5px] ${
                    notifiedLoads.has("0102") ? "text-[#757575]" : "text-white"
                  }`}>
                    {isNotifying && selectedLoad === "0102"
                      ? "Notifying..."
                      : notifiedLoads.has("0102")
                      ? "Notified"
                      : "Notify Customer"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: WORK QUEUE */}
          <div>
            <button
              onClick={() => setIsWorkQueueExpanded(!isWorkQueueExpanded)}
              className="w-full bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between cursor-pointer border-none"
            >
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[18px] uppercase">
                Work Queue
              </h2>
              <ChevronDown
                className={`w-6 h-6 text-[#3878c2] transition-transform ${
                  isWorkQueueExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isWorkQueueExpanded && (
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 mt-3">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px] mb-4">
                  Today's Summary
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[15px]">
                      Completed
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#4BAD40] text-[20px]">
                      20
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[15px]">
                      On-going
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[20px]">
                      5
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </MobileContainer>
  );
}
