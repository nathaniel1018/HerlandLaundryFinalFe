import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Filter, Plus, Download } from "lucide-react";
import { MobileContainer } from "../components/MobileContainer";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { BottomNav } from "../components/dashboard/BottomNav";
import { SideMenu } from "../components/dashboard/SideMenu";
import { DailySalesChart } from "../components/dashboard/DailySalesChart";
import { SalesTableRow } from "../components/sales/SalesTableRow";
import { SalesEntryModal, SalesEntry, TabType } from "../components/sales/SalesEntryModal";
import { FilterPanel, FilterOptions } from "../components/sales/FilterPanel";
import { SegmentedControl } from "../components/sales/SegmentedControl";

type SortField = "name" | "service" | "amount" | "date" | "paymentMethod" | "classification" | "washDate";
type SortOrder = "asc" | "desc";

export function SalesReportPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "profile text-blue-500">("sales");
  
  // Tab state
  const [currentTabType, setCurrentTabType] = useState<TabType>("unpaid");
  
  // Data state
  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SalesEntry | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  
  // Sort state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    paymentMethod: "ALL",
    service: "ALL",
    dateFrom: "",
    dateTo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>(filters);

  // --- FETCH REAL DATA ---
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Kunin ang token, checking both possible keys
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch("http://localhost:3000/transactions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch data");
      const json = await response.json();

      const transactionsArray = Array.isArray(json) ? json : (json.data || []);

      const liveData = transactionsArray.map((item: any): SalesEntry => {
        const pStatus = String(item.paymentStatus || "").trim().toUpperCase();
        const sStatus = String(item.serviceStatus || "").trim().toUpperCase();

        let mappedStatus: TabType = "unpaid";
        if (sStatus === "CLAIMED") {
          mappedStatus = "claimed";
        } else if (pStatus === "PAID") {
          mappedStatus = "paid";
        } else {
          mappedStatus = "unpaid";
        }

        const parsedTransactionDate = item.transactionDate ? item.transactionDate.split("T")[0] : new Date().toISOString().split("T")[0];
        const parsedWashDate = item.washDate ? item.washDate.split("T")[0] : parsedTransactionDate;

        return {
          id: String(item.id), 
          status: mappedStatus,
          name: item.customerName || "Unknown",
          service: item.serviceName || (item.items?.[0]?.service?.name || "N/A"),
          amount: item.amount !== undefined ? Number(item.amount) : (Number(item.totalAmount) || 0),
          date: parsedTransactionDate,
          paymentMethod: item.paymentMethod || undefined,
          classification: item.classification || "REGULAR",
          washDate: parsedWashDate
        };
      });

      setSalesData(liveData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter and Sort Logic
  const tabFilteredData = useMemo(() => {
    return salesData.filter(entry => entry.status === currentTabType);
  }, [salesData, currentTabType]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...tabFilteredData];

    if (appliedFilters.paymentMethod !== "ALL" && currentTabType === "paid") {
      filtered = filtered.filter(entry => entry.paymentMethod === appliedFilters.paymentMethod);
    }
    if (appliedFilters.service !== "ALL") {
      filtered = filtered.filter(entry => entry.service === appliedFilters.service);
    }
    if (appliedFilters.dateFrom) {
      filtered = filtered.filter(entry => entry.date >= appliedFilters.dateFrom);
    }
    if (appliedFilters.dateTo) {
      filtered = filtered.filter(entry => entry.date <= appliedFilters.dateTo);
    }

    filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof SalesEntry];
      let bVal: any = b[sortField as keyof SalesEntry];

      if (sortField === "amount") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tabFilteredData, appliedFilters, sortField, sortOrder, currentTabType]);

  const totalIncome = useMemo(() => {
    const total = filteredAndSortedData.reduce((sum, entry) => sum + entry.amount, 0);
    return `PHP ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [filteredAndSortedData]);

  // --- COMPUTE DATA FOR THE CHART ---
  const chartData = useMemo(() => {
    const grouped = salesData.reduce((acc: any, curr: any) => {
      if (curr.status !== "paid" && curr.status !== "claimed") return acc;

      const dateStr = curr.date;
      if (!acc[dateStr]) {
        acc[dateStr] = { val1: 0, val2: 0, val3: 0 };
      }

      const amount = Number(curr.amount) || 0;
      const serviceName = (curr.service || "").toUpperCase();

      if (serviceName === "WASH") {
        acc[dateStr].val1 += amount;
      } else if (serviceName === "DRY") {
        acc[dateStr].val2 += amount;
      } else {
        acc[dateStr].val3 += amount; 
      }

      return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort();
    return sortedDates.map(date => {
      const d = new Date(date);
      const label = isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      return {
        label,
        val1: grouped[date].val1,
        val2: grouped[date].val2,
        val3: grouped[date].val3
      };
    }).slice(-7); 
  }, [salesData]);

  const handleTabChange = (tab: TabType) => {
    setCurrentTabType(tab);
    handleResetFilters();
  };

  const handleEditEntry = (entry: SalesEntry) => {
    setModalMode("edit");
    setEditingEntry(entry);
    setShowEntryModal(true);
  };

  // --- DELETE LOGIC ---
  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please log in again.");
          return;
        }

        const response = await fetch(`http://localhost:3000/transactions/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Failed to delete from database");

        setSalesData(prev => prev.filter(entry => entry.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Could not delete the entry. Please try again.");
      }
    }
  };

  // --- SAVE/UPDATE LOGIC ---
  const handleSaveEntry = async (entry: Omit<SalesEntry, "id"> | SalesEntry) => {
    
    const payload = {
      customerName: entry.name, 
      serviceName: entry.service, 
      amount: Number(entry.amount), 
      paymentMethod: entry.paymentMethod || "CASH", 
      paymentStatus: entry.status === "paid" || entry.status === "claimed" ? "PAID" : "UNPAID",
      serviceStatus: entry.status === "claimed" ? "CLAIMED" : "ON_GOING", 
      transactionDate: entry.date ? new Date(entry.date).toISOString() : new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      if ("id" in entry) {
        // UPDATE
        const response = await fetch(`http://localhost:3000/transactions/${entry.id}`, {
          method: "PATCH", 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message || "Update failed");
        }

        setSalesData(prev => prev.map(e => e.id === entry.id ? (entry as SalesEntry) : e));
      } else {
        // CREATE
        const response = await fetch("http://localhost:3000/transactions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = Array.isArray(errorData.message) 
            ? errorData.message.join("\n") 
            : errorData.message || "Creation failed";
          
          throw new Error(errorMessage);
        }
        
        const savedRecord = await response.json();
        const newId = String(savedRecord.id || savedRecord.data?.id || Date.now());

        const newEntry: SalesEntry = {
          ...entry,
          id: newId,
          status: entry.status || currentTabType, 
        };
        
        setSalesData(prev => [...prev, newEntry]);
      }
      setShowEntryModal(false);
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Backend Error:\n${error.message}`); 
    }
  };

  // Filter/Sort Helpers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };

  const handleApplyFilters = () => setAppliedFilters(filters);

  const handleResetFilters = () => {
    const reset = { paymentMethod: "ALL", service: "ALL", dateFrom: "", dateTo: "" };
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const handleDownload = () => {
    const headers = currentTabType === "unpaid" 
      ? ["Customer", "Service", "Amount", "Date"] 
      : ["Customer", "Payment", "Service", "Amount", "Date"];
    
    const rows = filteredAndSortedData.map(e => [
      e.name, 
      currentTabType === "paid" ? e.paymentMethod : e.service, 
      e.service, 
      e.amount.toFixed(2), 
      e.date
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${currentTabType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const hasActiveFilters = appliedFilters.paymentMethod !== "ALL" || 
                           appliedFilters.service !== "ALL" || 
                           appliedFilters.dateFrom !== "" || 
                           appliedFilters.dateTo !== "";
  return (
    <MobileContainer>
      <div className="bg-[#f5f5f5] relative size-full flex flex-col overflow-x-hidden">
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
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Welcome Section */}
          <div className="px-6 pt-4 pb-2 bg-white">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[16px] leading-[24px]">
              Welcome back, User
            </p>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[#3878c2] text-[24px] leading-[32px] mb-4">
              Sales Report
            </h1>
            
            {/* Segmented Control */}
            <SegmentedControl 
              activeTab={currentTabType} 
              onTabChange={handleTabChange} 
            />
          </div>

          {/* Daily Sales Chart */}
          <div className="px-6 py-4 bg-white mb-2 mt-2">
            <DailySalesChart />
          </div>

          {/* Section Title */}
          <div className="px-6 py-3 bg-white mb-2">
            <h2 className="font-semibold text-[#3878c2] text-[18px]">
              {currentTabType === "unpaid" ? "Unpaid Sales" : currentTabType === "paid" ? "Paid Sales" : "Claimed Items"}
            </h2>
          </div>


          {/* Actions Bar */}
          <div className="px-6 py-4 bg-white flex items-center gap-3 mb-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterPanel(true)}
                className={`${hasActiveFilters ? 'bg-[#4bad40]' : 'bg-[#3878c2]'} flex items-center gap-2 h-[30px] px-[8px] py-[6px] rounded-[3px] border-none cursor-pointer hover:opacity-90`}
              >
                <Filter className="size-[16px]" color="white" strokeWidth={2} />
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] text-[12px] text-white whitespace-nowrap">
                  FILTER
                </p>
                {hasActiveFilters && (
                  <span className="bg-white text-[#4bad40] rounded-full size-[18px] flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Sort By Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="bg-[#3878c2] flex items-center gap-2 h-[30px] px-[8px] py-[6px] rounded-[3px] border-none cursor-pointer hover:opacity-90"
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] text-[12px] text-white whitespace-nowrap">
                  SORT
                </p>
                <ChevronDown className="size-[16px]" color="white" strokeWidth={2} />
              </button>
              
              {/* Sort Dropdown Menu */}
              {showSortMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e2e6] rounded shadow-lg z-10 min-w-[150px]">
                  <button 
                    onClick={() => handleSort("name")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("service")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Service {sortField === "service" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("amount")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("date")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  {currentTabType === "paid" && (
                    <button 
                      onClick={() => handleSort("paymentMethod")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                    >
                      By Payment {sortField === "paymentMethod" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  )}
                  {currentTabType === "claimed" && (
                    <>
                      <button 
                        onClick={() => handleSort("classification")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                      >
                        By Classification {sortField === "classification" && (sortOrder === "asc" ? "↑" : "↓")}
                      </button>
                      <button 
                        onClick={() => handleSort("washDate")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                      >
                        By Wash Date {sortField === "washDate" && (sortOrder === "asc" ? "↑" : "↓")}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Add New Entry Button */}
            <button onClick={() => { setModalMode("add"); setEditingEntry(null); setShowEntryModal(true); }} className="bg-[#3878c2] flex items-center gap-2 h-[30px] px-2 rounded text-white text-[12px] flex-1">

            
              <Plus className="size-[16px]" color="white" strokeWidth={2} />
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] text-[12px] text-white whitespace-nowrap">
                ADD ENTRY
              </p>
            </button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="px-6 py-2 bg-white mb-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-[#3a3e44] font-['Inter:Semi_Bold',sans-serif]">
                  Active Filters:
                </span>
                {appliedFilters.paymentMethod !== "ALL" && currentTabType === "paid" && (
                  <span className="bg-[#d5e9f8] text-[#006c9f] px-2 py-1 rounded text-[10px]">
                    Payment: {appliedFilters.paymentMethod}
                  </span>
                )}
                {appliedFilters.service !== "ALL" && (
                  <span className="bg-[#d5e9f8] text-[#006c9f] px-2 py-1 rounded text-[10px]">
                    Service: {appliedFilters.service}
                  </span>
                )}
                {appliedFilters.dateFrom && (
                  <span className="bg-[#d5e9f8] text-[#006c9f] px-2 py-1 rounded text-[10px]">
                    From: {appliedFilters.dateFrom}
                  </span>
                )}
                {appliedFilters.dateTo && (
                  <span className="bg-[#d5e9f8] text-[#006c9f] px-2 py-1 rounded text-[10px]">
                    To: {appliedFilters.dateTo}
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-[#e74c3c] text-[10px] underline bg-transparent border-none cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Sales Table */}
          <div className="px-6 py-4 bg-white">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px]">
                {filteredAndSortedData.length} {filteredAndSortedData.length === 1 ? 'Entry' : 'Entries'}
              </p>
              {tabFilteredData.length !== filteredAndSortedData.length && (
                <p className="font-['Inter:Regular',sans-serif] text-[#ababab] text-[10px]">
                  (Filtered from {tabFilteredData.length} total)
                </p>
              )}
            </div>

            {/* Table Header - Unpaid */}
            {currentTabType === "unpaid" && (
              <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.7fr_60px] gap-3 pb-3 border-b-2 border-[#e74c3c]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  CUSTOMER
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  SERVICE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  AMOUNT
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  DATE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  ACTION
                </p>
              </div>
            )}

            {/* Table Header - Paid */}
            {currentTabType === "paid" && (
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr_60px] gap-3 pb-3 border-b-2 border-[#4bad40]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  CUSTOMER
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  PAYMENT
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  SERVICE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  AMOUNT
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  DATE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  ACTION
                </p>
              </div>
            )}

            {/* Table Header - Claimed */}
            {currentTabType === "claimed" && (
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.7fr_60px] gap-3 pb-3 border-b-2 border-[#3878c2]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  CUSTOMER
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  CLASS
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  WASH DATE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  AMOUNT
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  CLAIM DATE
                </p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  ACTION
                </p>
              </div>
            )}

            {/* Table Rows */}
            <div className="flex flex-col">
              {filteredAndSortedData.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-['Inter:Regular',sans-serif] text-[#ababab] text-[12px]">
                    No {currentTabType} entries found
                  </p>
                  <button
                    onClick={hasActiveFilters ? handleResetFilters : () => { setModalMode("add"); setEditingEntry(null); setShowEntryModal(true); }}
                    className="mt-4 px-4 py-2 bg-[#3878c2] text-white rounded-[4px] font-['Inter:Medium',sans-serif] text-[12px] border-none cursor-pointer hover:bg-[#2d6aa8]"
                  >
                    {hasActiveFilters ? "Clear Filters" : "Add First Entry"}
                  </button>
                </div>
              ) : (
                filteredAndSortedData.map((row) => (
                  <SalesTableRow
                    key={row.id}
                    tabType={currentTabType}
                    name={row.name}
                    service={row.service}
                    amount={row.amount}
                    date={row.date}
                    paymentMethod={row.paymentMethod}
                    classification={row.classification}
                    washDate={row.washDate}
                    onEdit={() => handleEditEntry(row)}
                    onDelete={() => handleDeleteEntry(row.id)}
                  />
                ))
              )}
            </div>

            {/* Total */}
            {filteredAndSortedData.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-[#002540] flex justify-between items-center">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.3] text-[#002540] text-[10px]">
                  {hasActiveFilters ? "FILTERED TOTAL" : "TOTAL"}
                </p>
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[1.3] text-[#002540] text-[12px]">
                  {totalIncome}
                </p>
              </div>
            )}

            {/* Download Button */}
            {filteredAndSortedData.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleDownload}
                  className="bg-[#4bad40] flex items-center gap-3 h-[30px] px-[8px] py-[6px] rounded-[3px] border-none cursor-pointer hover:opacity-90"
                >
                  <Download className="size-[20px]" color="white" strokeWidth={2} />
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.3] text-[12px] text-white whitespace-nowrap">
                    DOWNLOAD CSV
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab="sales"
          onTabChange={(tab) => navigate(tab === "home" ? "/dashboard" : `/${tab}`)} />

        {/* Modals */}
        <SalesEntryModal
          isOpen={showEntryModal}
          onClose={() => setShowEntryModal(false)}
          onSave={handleSaveEntry}
          entry={editingEntry}
          mode={modalMode}
          tabType={currentTabType}
        />

        <FilterPanel
          isOpen={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          filters={filters}
          onFilterChange={setFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </div>
    </MobileContainer>
  );
}