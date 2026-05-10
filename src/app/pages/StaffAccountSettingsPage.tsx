import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { ArrowLeft, ChevronRight, Phone, Lock, Bell, Globe } from "lucide-react";

export function StaffAccountSettingsPage() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <MobileContainer>
      <div className="relative h-screen overflow-y-auto bg-gradient-to-br from-[#E8F4F8] to-[#F0F9FF]">
        <div className="pb-8">
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
                Settings
              </h1>
            </div>
          </div>

          {/* Settings Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Account Info Section */}
            <div>
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] uppercase mb-3 px-2">
                Account Info
              </h2>
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Phone Number */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between border-none bg-transparent cursor-pointer hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#3878c2]" />
                    <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                      Phone Number
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#757575]" />
                </button>

                {/* Change Password */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between border-none bg-transparent cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#3878c2]" />
                    <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                      Change Password
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#757575]" />
                </button>
              </div>
            </div>

            {/* App Preferences Section */}
            <div>
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] uppercase mb-3 px-2">
                App Preferences
              </h2>
              <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Notifications */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#3878c2]" />
                    <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                      Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${
                      notificationsEnabled ? "bg-[#3878c2]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        notificationsEnabled ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Language */}
                <button
                  className="w-full px-5 py-4 flex items-center justify-between border-none bg-transparent cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#3878c2]" />
                    <div className="flex flex-col items-start">
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px]">
                        Language
                      </span>
                      <span className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px]">
                        English PH
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#757575]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
