import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { ArrowLeft } from "lucide-react";

interface DutyDay {
  day: string;
  time: string;
  status: "COMPLETED" | "ON-DUTY" | "UPCOMING" | "REST";
}

const dutySchedule: DutyDay[] = [
  { day: "MONDAY", time: "8:00 AM – 5:00 PM", status: "COMPLETED" },
  { day: "TUESDAY", time: "8:00 AM – 5:00 PM", status: "COMPLETED" },
  { day: "WEDNESDAY", time: "8:00 AM – 5:00 PM", status: "ON-DUTY" },
  { day: "THURSDAY", time: "8:00 AM – 5:00 PM", status: "UPCOMING" },
  { day: "FRIDAY", time: "8:00 AM – 5:00 PM", status: "UPCOMING" },
  { day: "SATURDAY", time: "Day Off", status: "REST" },
  { day: "SUNDAY", time: "Day Off", status: "REST" },
];

export function StaffDutySchedulePage() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") return "bg-[#4BAD40]/10 text-[#4BAD40]";
    if (status === "ON-DUTY") return "bg-[#3878c2]/10 text-[#3878c2]";
    if (status === "UPCOMING") return "bg-[#757575]/10 text-[#757575]";
    if (status === "REST") return "bg-[#EF4444]/10 text-[#EF4444]";
    return "";
  };

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
                Duty Schedule
              </h1>
            </div>
          </div>

          {/* Schedule List */}
          <div className="px-6 py-6 space-y-3">
            {dutySchedule.map((duty, index) => (
              <div
                key={index}
                className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px] mb-1 uppercase">
                      {duty.day}
                    </h3>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[14px]">
                      {duty.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px] uppercase ${getStatusColor(duty.status)}`}>
                    {duty.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
