import svgPaths from "../../../imports/svg-o1uwdo2krw";
import { Package } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "sales" | "history" | "inventory" | "profile";
  onTabChange: (tab: "home" | "sales" | "history" | "inventory" | "profile") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 pointer-events-none z-30">
      <div className="bg-[#3878c2] rounded-[60px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] px-4 py-[10px] flex items-center justify-between gap-2 pointer-events-auto w-full max-w-[380px]">
        {/* Home Tab */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex items-center justify-center gap-2 px-[10px] py-[7px] rounded-[50px] border-none cursor-pointer transition-colors ${
            activeTab === "home" ? "bg-white" : "bg-transparent"
          }`}
        >
          <svg className="size-[24px] flex-shrink-0" fill="none" viewBox="0 0 24 24">
            {activeTab === "home" ? (
              <>
                <path 
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                  fill="#3878C2"
                />
                <path 
                  d="M9 22V12H15V22" 
                  fill="#3878C2"
                />
                <path 
                  d={svgPaths.p29d36100}
                  stroke="#3878C2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2"
                />
              </>
            ) : (
              <path 
                d={svgPaths.p27eb6300}
                stroke="#78ACE7" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2"
              />
            )}
          </svg>
          {activeTab === "home" && (
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px] whitespace-nowrap">
              Home
            </p>
          )}
        </button>

        {/* Sales Tab */}
        <button
          onClick={() => onTabChange("sales")}
          className={`flex items-center justify-center gap-2 px-[10px] py-[7px] rounded-[50px] border-none cursor-pointer transition-colors ${
            activeTab === "sales" ? "bg-white" : "bg-transparent"
          }`}
        >
          <svg className="size-[24px] flex-shrink-0" fill="none" viewBox="0 0 26 26">
            <path
              d={svgPaths.p21936930}
              stroke={activeTab === "sales" ? "#3878C2" : "#78ACE7"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          {activeTab === "sales" && (
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px] whitespace-nowrap">
              Sales
            </p>
          )}
        </button>

        {/* History Tab */}
        <button
          onClick={() => onTabChange("history")}
          className={`flex items-center justify-center gap-2 px-[10px] py-[7px] rounded-[50px] border-none cursor-pointer transition-colors ${
            activeTab === "history" ? "bg-white" : "bg-transparent"
          }`}
        >
          <svg className="size-[24px] flex-shrink-0" fill="none" viewBox="0 0 26 26">
            <path
              d={svgPaths.p16d33070}
              stroke={activeTab === "history" ? "#3878C2" : "#78ACE7"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          {activeTab === "history" && (
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px] whitespace-nowrap">
              History
            </p>
          )}
        </button>

        {/* Inventory Tab */}
        <button
          onClick={() => onTabChange("inventory")}
          className={`flex items-center justify-center gap-2 px-[10px] py-[7px] rounded-[50px] border-none cursor-pointer transition-colors ${
            activeTab === "inventory" ? "bg-white" : "bg-transparent"
          }`}
        >
          <Package
            className="size-[24px] flex-shrink-0"
            color={activeTab === "inventory" ? "#3878C2" : "#78ACE7"}
            strokeWidth={2}
          />
          {activeTab === "inventory" && (
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px] whitespace-nowrap">
              Inventory
            </p>
          )}
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange("profile")}
          className={`flex items-center justify-center gap-2 px-[10px] py-[7px] rounded-[50px] border-none cursor-pointer transition-colors ${
            activeTab === "profile" ? "bg-white" : "bg-transparent"
          }`}
        >
          <svg className="size-[24px] flex-shrink-0" fill="none" viewBox="0 0 26 26">
            <path
              d={svgPaths.p2e37b18}
              stroke={activeTab === "profile" ? "#3878C2" : "#78ACE7"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          {activeTab === "profile" && (
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[15px] whitespace-nowrap">
              Profile
            </p>
          )}
        </button>
      </div>
    </div>
  );
}
