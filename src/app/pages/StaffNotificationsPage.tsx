import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";

interface Notification {
  id: number;
  type: "info" | "warning";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function StaffNotificationsPage() {
  const navigate = useNavigate();
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "info",
      title: "New Load Assignment",
      message: "LOAD #0103 has been assigned to you for processing",
      time: "5 mins ago",
      isRead: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Low Stock Alert",
      message: "Detergent Powder is running low. Please notify admin.",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      type: "info",
      title: "Schedule Update",
      message: "Your duty schedule for next week has been updated",
      time: "2 hours ago",
      isRead: true,
    },
    {
      id: 4,
      type: "info",
      title: "Load Completed",
      message: "LOAD #0098 has been completed and is ready for pick-up",
      time: "5 hours ago",
      isRead: true,
    },
  ]);

  return (
    <MobileContainer>
      <div className="relative min-h-screen bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        {/* Header */}
        <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-transparent border-none cursor-pointer mr-2"
            >
              <ArrowLeft className="w-6 h-6 text-[#3878c2]" />
            </button>
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[24px]">
              Notifications
            </h1>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-6 py-6 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 ${
                !notification.isRead ? "border-l-4 border-[#3878c2]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === "warning"
                      ? "bg-[#F59E0B]/10"
                      : "bg-[#3878c2]/10"
                  }`}
                >
                  {notification.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                  ) : (
                    <Package className="w-5 h-5 text-[#3878c2]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px]">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#3878c2] rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px] mb-2">
                    {notification.message}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#3878c2] text-[11px]">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileContainer>
  );
}
