import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { StatsCard } from "../components/dashboard/StatsCard";
import { DailySalesChart } from "../components/dashboard/DailySalesChart";
import { ActionCard } from "../components/dashboard/ActionCard";
import { BottomNav } from "../components/dashboard/BottomNav";
import { SideMenu } from "../components/dashboard/SideMenu";

export function DashboardPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("home");

  const handleNavigation = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "sales") {
      navigate("/sales-report");
    } else if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "history") {
      navigate("/history");
    } else if (tab === "inventory") {
      navigate("/inventory");
    }
  };

  return (
    <MobileContainer>
      <div className="bg-white relative size-full flex flex-col overflow-x-hidden">
        {/* Side Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Side Menu */}
        <SideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
          onLogout={() => navigate("/login")}
        />

        {/* Header */}
        <DashboardHeader 
          userName="User"
          onNotificationClick={() => navigate("/notifications")}
          onMenuClick={() => setIsMenuOpen(true)}
          onAvatarClick={() => navigate("/profile")}
          notificationCount={3}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Welcome Section */}
          <div className="px-6 pt-4 pb-2">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[20px] leading-[30px]">
              Welcome back, User
            </p>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[#3878c2] text-[28px] leading-[36px]">
              Dashboard
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="px-6 mb-4 flex gap-3 overflow-x-auto scrollbar-hide">
            <StatsCard
              icon="chart"
              title="Total sales"
              value="₱15,521"
              decimal=".50"
              change="-1.21%"
              changeType="decrease"
            />
            <StatsCard
              icon="users"
              title="New customers"
              value="389"
              change="+5.25%"
              changeType="increase"
            />
          </div>

          {/* Daily Sales Chart */}
          <div className="px-6 mb-4">
            <DailySalesChart />
          </div>

          {/* Action Cards */}
          <div className="px-6 pb-6 flex flex-col gap-4">
            <ActionCard
              title="Sales Report"
              description="View, modify, and update current sales database."
              buttonText="Go to Sales Report"
              onClick={() => navigate("/sales-report")}
            />
            <ActionCard
              title="Transaction History"
              description="View and edit current status of an order. View past transactions."
              buttonText="Go to Transaction History"
              onClick={() => {/* Navigate to transaction history */}}
            />
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab={activeTab}
          onTabChange={handleNavigation}
        />
      </div>
    </MobileContainer>
  );
}