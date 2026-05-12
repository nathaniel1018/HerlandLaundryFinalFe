export interface DailyChartData {
  label: string; // e.g., "Oct 12", "Oct 13"
  val1: number;  // Blue bar
  val2: number;  // Green bar
  val3: number;  // Light Blue bar
}

interface DailySalesChartProps {
  data?: DailyChartData[];
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  // 2. Kung walang pinasa na data, gagamitin niya 'yung original dummy data mo para hindi masira ang UI
  const chartData = data && data.length > 0 ? data : [
    { label: "Day 1", val1: 20, val2: 30, val3: 25 },
    { label: "Day 2", val1: 25, val2: 35, val3: 30 },
    { label: "Day 3", val1: 50, val2: 45, val3: 55 },
    { label: "Day 4", val1: 35, val2: 55, val3: 50 },
    { label: "Day 5", val1: 30, val2: 35, val3: 40 },
    { label: "Day 6", val1: 60, val2: 65, val3: 75 },
  ];

  // 3. Dynamic Calculation: Hahanapin niya yung pinakamataas na benta para alam niya kung hanggang saan ang Y-Axis
  const maxDataValue = Math.max(
    ...chartData.map(d => Math.max(d.val1, d.val2, d.val3)),
    120 // minimum limit
  );
  
  // Hahatiin natin sa 6 steps para mag-match sa 7 gridLines mo
  const step = Math.ceil(maxDataValue / 6 / 10) * 10; 
  const maxValue = step * 6;
  const gridLines = [maxValue, step * 5, step * 4, step * 3, step * 2, step, 0];

  return (
    <div className="bg-white rounded-[8px] border border-[#e0e2e6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] p-6">
      {/* Title */}
      <h3 className="font-['Poppins:Medium',sans-serif] text-[#3a3e44] text-[18px] leading-[28px] mb-2">
        Daily Sales
      </h3>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="size-[8px] rounded-full bg-[#3878c2]" />
          <p className="font-['Inter:Regular',sans-serif] text-[#3a3e44] text-[10px]">Jan</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-[8px] rounded-full bg-[#4bad40]" />
          <p className="font-['Inter:Regular',sans-serif] text-[#3a3e44] text-[10px]">Feb</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-[8px] rounded-full bg-[#63bce6]" />
          <p className="font-['Inter:Regular',sans-serif] text-[#3a3e44] text-[10px]">March</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-2 h-[180px]">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between py-1 text-right">
          {gridLines.map((value) => (
            <p key={value} className="font-['Inter:Regular',sans-serif] text-[#3a3e44] text-[10px] leading-[10px]">
              {value}
            </p>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {gridLines.slice(0, -1).map((_, index) => (
              <div 
                key={index} 
                className="border-t border-dashed border-[#bec1c6] w-full"
              />
            ))}
            <div className="border-t border-[#bec1c6] w-full" />
          </div>

          {/* Bars */}
          <div className="absolute inset-x-0 bottom-6 top-0 flex items-end justify-around gap-1 px-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex items-end gap-[2px] h-full">
                <div 
                  className="flex-1 bg-[#3878c2] rounded-t"
                  style={{ height: `${(data.val1 / maxValue) * 100}%` }}
                />
                <div 
                  className="flex-1 bg-[#4bad40] rounded-t"
                  style={{ height: `${(data.val2 / maxValue) * 100}%` }}
                />
                <div 
                  className="flex-1 bg-[#63bce6] rounded-t"
                  style={{ height: `${(data.val3 / maxValue) * 100}%` }}
                />
              </div>
            ))}
          </div>

          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2">
            {chartData.map((data, index) => (
              <p 
                key={index} 
                className="flex-1 font-['Inter:Regular',sans-serif] text-[#3a3e44] text-[10px] text-center"
              >
                000
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
