import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, Clock, CheckCircle, Check, Filter, Plus, ChevronDown, X, Home, History, TrendingUp, Package, Settings, LogOut } from "lucide-react";

type TabType = "unpaid" | "paid" | "claimed";

interface SalesEntry {
  id: number;
  customer: string;
  service: string;
  amount: number;
  method?: string;
  classification?: string;
  washDate?: string;
}

interface NewEntryForm {
  customer: string;
  service: string;
  amount: string;
  paymentMethod: string;
  status: "unpaid" | "paid" | "claimed";
}

const initialUnpaidData: SalesEntry[] = [
  { id: 1, customer: "Juan Dela Cruz", service: "Wash", amount: 150 },
  { id: 2, customer: "Maria Santos", service: "Fold", amount: 200 },
  { id: 3, customer: "Pedro Garcia", service: "Wash & Dry", amount: 250 },
  { id: 4, customer: "Rosa Cruz", service: "Dry", amount: 100 },
];

const initialPaidData: SalesEntry[] = [
  { id: 1, customer: "Alice Reyes", service: "Dry", amount: 120, method: "Cash" },
  { id: 2, customer: "Jose Lopez", service: "Wash", amount: 150, method: "GCash" },
  { id: 3, customer: "Ana Martinez", service: "Full Service", amount: 180, method: "Cash" },
];

const initialClaimedData: SalesEntry[] = [
  { id: 1, customer: "Marco Dela Cruz", service: "Wash", amount: 150, classification: "Regular", washDate: "Feb 1" },
  { id: 2, customer: "Sofia Reyes", service: "Full Service", amount: 500, classification: "VIP", washDate: "Feb 3" },
  { id: 3, customer: "Elena Santos", service: "Fold", amount: 170, classification: "Member", washDate: "Feb 5" },
];

export function StaffSalesReportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("sales");
  const [currentTab, setCurrentTab] = useState<TabType>("unpaid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newEntryId, setNewEntryId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesEntry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"date-newest" | "date-oldest" | "amount-high" | "amount-low" | "name-az" | "name-za">("date-newest");
  const [filters, setFilters] = useState({
    dateRange: "all",
    paymentMethod: "all",
    service: "all",
  });

  const [unpaidData, setUnpaidData] = useState<SalesEntry[]>(initialUnpaidData);
  const [paidData, setPaidData] = useState<SalesEntry[]>(initialPaidData);
  const [claimedData, setClaimedData] = useState<SalesEntry[]>(initialClaimedData);

  const [formData, setFormData] = useState<NewEntryForm>({
    customer: "",
    service: "",
    amount: "",
    paymentMethod: "",
    status: "unpaid",
  });

  const [errors, setErrors] = useState({
    customer: "",
    service: "",
    amount: "",
    paymentMethod: "",
  });

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/staff-dashboard");
    else if (tab === "history") navigate("/staff-history");
    else if (tab === "inventory") navigate("/staff-inventory");
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

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setFormData({
      customer: "",
      service: "",
      amount: "",
      paymentMethod: "",
      status: "unpaid",
    });
    setErrors({
      customer: "",
      service: "",
      amount: "",
      paymentMethod: "",
    });
  };

  const validateForm = () => {
    const newErrors = {
      customer: formData.customer.trim() ? "" : "Customer name is required",
      service: formData.service ? "" : "Service is required",
      amount: formData.amount && parseFloat(formData.amount) > 0 ? "" : "Valid amount is required",
      paymentMethod: formData.status === "paid" && !formData.paymentMethod ? "Payment method is required" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSaveEntry = () => {
    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);
    const newId = Math.max(
      ...unpaidData.map(e => e.id),
      ...paidData.map(e => e.id),
      ...claimedData.map(e => e.id)
    ) + 1;

    const newEntry: SalesEntry = {
      id: newId,
      customer: formData.customer,
      service: formData.service,
      amount: amount,
      ...(formData.status === "paid" && { method: formData.paymentMethod }),
      ...(formData.status === "claimed" && { classification: "Regular", washDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }),
    };

    if (formData.status === "unpaid") {
      setUnpaidData([newEntry, ...unpaidData]);
    } else if (formData.status === "paid") {
      setPaidData([newEntry, ...paidData]);
    } else {
      setClaimedData([newEntry, ...claimedData]);
    }

    setNewEntryId(newId);
    setShowAddModal(false);
    setSuccessMessage("New sales entry added successfully");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setNewEntryId(null);
    }, 3000);
  };

  const handleTransactionClick = (entry: SalesEntry) => {
    setSelectedTransaction(entry);
    setShowDetailsModal(true);
  };

  const handleMarkAsPaid = () => {
    if (!selectedTransaction) return;

    // Remove from unpaid
    setUnpaidData(unpaidData.filter(e => e.id !== selectedTransaction.id));

    // Add to paid with payment method
    setPaidData([{...selectedTransaction, method: "Cash"}, ...paidData]);

    setShowDetailsModal(false);
    setSelectedTransaction(null);
    setSuccessMessage("Payment recorded successfully");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleMarkAsClaimed = () => {
    if (!selectedTransaction) return;

    // Remove from paid
    setPaidData(paidData.filter(e => e.id !== selectedTransaction.id));

    // Add to claimed
    setClaimedData([{
      ...selectedTransaction,
      classification: "Regular",
      washDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }, ...claimedData]);

    setShowDetailsModal(false);
    setSelectedTransaction(null);
    setSuccessMessage("Order marked as claimed");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleApplySort = (sortOption: typeof sortBy) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
  };

  const handleApplyFilter = () => {
    setShowFilterModal(false);
  };

  const handleResetFilter = () => {
    setFilters({
      dateRange: "all",
      paymentMethod: "all",
      service: "all",
    });
  };

  const getSummaryData = () => {
    if (currentTab === "unpaid") {
      const total = unpaidData.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        label: "UNPAID TOTAL",
        subtext: "Pending Payments",
        amount: total,
        icon: <Clock className="w-6 h-6 text-[#F59E0B]" />,
        color: "bg-[#F59E0B]/10",
      };
    } else if (currentTab === "paid") {
      const total = paidData.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        label: "TODAY'S PAID",
        subtext: "Cash and GCash Sales",
        amount: total,
        icon: <Check className="w-6 h-6 text-[#4BAD40]" />,
        color: "bg-[#4BAD40]/10",
      };
    } else {
      const total = claimedData.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        label: "CLAIMED VALUE",
        subtext: "Released Order",
        amount: total,
        icon: <CheckCircle className="w-6 h-6 text-[#4BAD40]" />,
        color: "bg-[#4BAD40]/10",
      };
    }
  };

  const getCurrentData = () => {
    let data: SalesEntry[] = [];
    if (currentTab === "unpaid") data = unpaidData;
    else if (currentTab === "paid") data = paidData;
    else data = claimedData;

    return applySortAndFilter(data);
  };

  const getTotalUnpaid = () => {
    return unpaidData.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const isFormValid = () => {
    return (
      formData.customer.trim() !== "" &&
      formData.service !== "" &&
      formData.amount !== "" &&
      parseFloat(formData.amount) > 0 &&
      (formData.status !== "paid" || formData.paymentMethod !== "")
    );
  };

  const applySortAndFilter = (data: SalesEntry[]) => {
    // Apply filters
    let filtered = data.filter(entry => {
      if (filters.service !== "all" && entry.service !== filters.service) return false;
      if (currentTab === "paid" && filters.paymentMethod !== "all" && entry.method !== filters.paymentMethod) return false;
      return true;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return b.id - a.id; // Assuming higher ID = newer
        case "date-oldest":
          return a.id - b.id;
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        case "name-az":
          return a.customer.localeCompare(b.customer);
        case "name-za":
          return b.customer.localeCompare(a.customer);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const summary = getSummaryData();

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
                Sales Report
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-[20px] p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex gap-1">
              <button
                onClick={() => setCurrentTab("unpaid")}
                className={`flex-1 py-2.5 px-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-[14px] border-none cursor-pointer transition-all ${
                  currentTab === "unpaid"
                    ? "bg-[#3878c2] text-white shadow-[0_2px_4px_rgba(56,120,194,0.3)]"
                    : "bg-transparent text-[#757575]"
                }`}
              >
                Unpaid
              </button>
              <button
                onClick={() => setCurrentTab("paid")}
                className={`flex-1 py-2.5 px-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-[14px] border-none cursor-pointer transition-all ${
                  currentTab === "paid"
                    ? "bg-[#3878c2] text-white shadow-[0_2px_4px_rgba(56,120,194,0.3)]"
                    : "bg-transparent text-[#757575]"
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setCurrentTab("claimed")}
                className={`flex-1 py-2.5 px-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-[14px] border-none cursor-pointer transition-all ${
                  currentTab === "claimed"
                    ? "bg-[#3878c2] text-white shadow-[0_2px_4px_rgba(56,120,194,0.3)]"
                    : "bg-transparent text-[#757575]"
                }`}
              >
                Claimed
              </button>
            </div>

            {/* Summary Card */}
            <div className={`${summary.color} rounded-[20px] p-5 flex items-center gap-4`}>
              <div className="flex-shrink-0">{summary.icon}</div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[12px] uppercase mb-1">
                  {summary.label}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[11px] mb-2">
                  {summary.subtext}
                </p>
                <p className="font-['Poppins:Bold',sans-serif] text-[#1e1e1e] text-[24px]">
                  PHP {summary.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Filter / Action Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                    Sort By
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#757575]" />
                </button>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="bg-white border border-[#E5E7EB] rounded-[12px] p-2 flex items-center justify-center cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                >
                  <Filter className="w-5 h-5 text-[#757575]" />
                </button>

                {/* Sort Dropdown */}
                {showSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute top-12 left-0 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg z-40 min-w-[200px]">
                      <button
                        onClick={() => handleApplySort("date-newest")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "date-newest" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Date: Newest First
                        </span>
                      </button>
                      <button
                        onClick={() => handleApplySort("date-oldest")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "date-oldest" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Date: Oldest First
                        </span>
                      </button>
                      <button
                        onClick={() => handleApplySort("amount-high")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "amount-high" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Amount: High to Low
                        </span>
                      </button>
                      <button
                        onClick={() => handleApplySort("amount-low")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "amount-low" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Amount: Low to High
                        </span>
                      </button>
                      <button
                        onClick={() => handleApplySort("name-az")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "name-az" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Name: A–Z
                        </span>
                      </button>
                      <button
                        onClick={() => handleApplySort("name-za")}
                        className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                          sortBy === "name-za" ? "bg-[#F0F9FF]" : ""
                        }`}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                          Name: Z–A
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-[#3878c2] rounded-[12px] px-4 py-2 flex items-center gap-2 border-none cursor-pointer hover:bg-[#2d5fa1] transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[13px]">
                  Add Entry
                </span>
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex items-center justify-center">
              <button className="bg-white rounded-[12px] px-5 py-2 border border-[#E5E7EB] cursor-pointer">
                <span className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px]">
                  FEB 2026
                </span>
              </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Table Header */}
              <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
                <div className="grid gap-3" style={{ gridTemplateColumns: currentTab === "unpaid" ? "2fr 1.5fr 1fr" : currentTab === "paid" ? "1.5fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr 1fr" }}>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                    Customer
                  </p>
                  {currentTab === "unpaid" && (
                    <>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                        Service
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase text-right">
                        Amount Due
                      </p>
                    </>
                  )}
                  {currentTab === "paid" && (
                    <>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                        Service
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                        Method
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase text-right">
                        Amount Due
                      </p>
                    </>
                  )}
                  {currentTab === "claimed" && (
                    <>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                        Classification
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                        Wash Date
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase text-right">
                        Amount Due
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#E5E7EB]">
                {getCurrentData().length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[14px]">
                      No transactions found
                    </p>
                  </div>
                ) : (
                  getCurrentData().map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => handleTransactionClick(entry)}
                      className={`px-4 py-3 transition-all duration-500 cursor-pointer hover:bg-[#F9FAFB] ${
                        entry.id === newEntryId ? "bg-[#4BAD40]/10 animate-fadeIn" : ""
                      }`}
                    >
                    <div className="grid gap-3 items-center" style={{ gridTemplateColumns: currentTab === "unpaid" ? "2fr 1.5fr 1fr" : currentTab === "paid" ? "1.5fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr 1fr" }}>
                      <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                        {entry.customer}
                      </p>
                      {currentTab === "unpaid" && (
                        <>
                          <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px]">
                            {entry.service}
                          </p>
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px] text-right">
                            ₱{entry.amount}
                          </p>
                        </>
                      )}
                      {currentTab === "paid" && (
                        <>
                          <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px]">
                            {entry.service}
                          </p>
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px] ${
                              entry.method === "Cash"
                                ? "bg-[#4BAD40]/10 text-[#4BAD40]"
                                : "bg-[#3878c2]/10 text-[#3878c2]"
                            }`}>
                              {entry.method}
                            </span>
                          </div>
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px] text-right">
                            ₱{entry.amount}
                          </p>
                        </>
                      )}
                      {currentTab === "claimed" && (
                        <>
                          <div>
                            <span className="inline-block px-2.5 py-1 rounded-full bg-[#4BAD40]/10 text-[#4BAD40] font-['Poppins:SemiBold',sans-serif] text-[11px]">
                              {entry.classification}
                            </span>
                          </div>
                          <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px]">
                            {entry.washDate}
                          </p>
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px] text-right">
                            ₱{entry.amount}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-[#3878c2] rounded-[20px] p-5">
              <div className="flex items-center justify-between">
                <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[14px] uppercase">
                  Total Unpaid
                </p>
                <p className="font-['Poppins:Bold',sans-serif] text-white text-[24px]">
                  PHP {getTotalUnpaid().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#4BAD40] text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slideDown max-w-[340px]">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p className="font-['Poppins:Medium',sans-serif] text-[14px]">
              {successMessage}
            </p>
          </div>
        )}

        {/* Add Entry Modal */}
        {showAddModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 w-full max-w-[360px] mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white rounded-t-[20px] px-6 pt-6 pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[20px]">
                  Add Sales Entry
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 bg-transparent border-none cursor-pointer"
                >
                  <X className="w-6 h-6 text-[#757575]" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px] mb-2 block">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  />
                  {errors.customer && (
                    <p className="font-['Poppins:Regular',sans-serif] text-[#EF4444] text-[12px] mt-1">
                      {errors.customer}
                    </p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px] mb-2 block">
                    Service *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  >
                    <option value="">Select service</option>
                    <option value="Wash">Wash</option>
                    <option value="Fold">Fold</option>
                    <option value="Wash & Dry">Wash & Dry</option>
                    <option value="Dry">Dry</option>
                  </select>
                  {errors.service && (
                    <p className="font-['Poppins:Regular',sans-serif] text-[#EF4444] text-[12px] mt-1">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px] mb-2 block">
                    Amount (PHP) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  />
                  {errors.amount && (
                    <p className="font-['Poppins:Regular',sans-serif] text-[#EF4444] text-[12px] mt-1">
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px] mb-2 block">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "unpaid" | "paid" | "claimed" })}
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="claimed">Claimed</option>
                  </select>
                </div>

                {/* Payment Method (only for Paid) */}
                {formData.status === "paid" && (
                  <div>
                    <label className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[14px] mb-2 block">
                      Payment Method *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                    >
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="GCash">GCash</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="font-['Poppins:Regular',sans-serif] text-[#EF4444] text-[12px] mt-1">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-white border-2 border-[#E5E7EB] h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-[#757575] text-[14px] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    disabled={!isFormValid()}
                    className={`flex-1 h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-[14px] border-none transition-all ${
                      isFormValid()
                        ? "bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] text-white cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)]"
                        : "bg-[#E5E7EB] text-[#757575] cursor-not-allowed"
                    }`}
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Transaction Details Modal */}
        {showDetailsModal && selectedTransaction && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetailsModal(false)}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-50 w-full max-w-[360px] mx-4 animate-slideUp">
              <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[20px]">
                  Transaction Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 bg-transparent border-none cursor-pointer"
                >
                  <X className="w-6 h-6 text-[#757575]" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                    Customer
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px]">
                    {selectedTransaction.customer}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                    Service
                  </p>
                  <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[15px]">
                    {selectedTransaction.service}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                    Amount
                  </p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[#1e1e1e] text-[20px]">
                    ₱{selectedTransaction.amount}
                  </p>
                </div>

                {selectedTransaction.method && (
                  <div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                      Payment Method
                    </p>
                    <span className={`inline-block px-3 py-1.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[13px] ${
                      selectedTransaction.method === "Cash"
                        ? "bg-[#4BAD40]/10 text-[#4BAD40]"
                        : "bg-[#3878c2]/10 text-[#3878c2]"
                    }`}>
                      {selectedTransaction.method}
                    </span>
                  </div>
                )}

                {selectedTransaction.classification && (
                  <div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                      Classification
                    </p>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-[#4BAD40]/10 text-[#4BAD40] font-['Poppins:SemiBold',sans-serif] text-[13px]">
                      {selectedTransaction.classification}
                    </span>
                  </div>
                )}

                {selectedTransaction.washDate && (
                  <div>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[12px] mb-1">
                      Wash Date
                    </p>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[15px]">
                      {selectedTransaction.washDate}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {currentTab === "unpaid" && (
                  <button
                    onClick={handleMarkAsPaid}
                    className="w-full bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-white text-[14px] border-none cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)] transition-all mt-6"
                  >
                    Mark as Paid
                  </button>
                )}

                {currentTab === "paid" && (
                  <button
                    onClick={handleMarkAsClaimed}
                    className="w-full bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-white text-[14px] border-none cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)] transition-all mt-6"
                  >
                    Mark as Claimed
                  </button>
                )}

                {currentTab === "claimed" && (
                  <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px] text-center pt-4">
                    This transaction has been completed
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilterModal(false)}
            />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] z-50 max-h-[80vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white rounded-t-[24px] px-6 pt-6 pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[#184e8d] text-[20px]">
                  Filter Transactions
                </h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 bg-transparent border-none cursor-pointer"
                >
                  <X className="w-6 h-6 text-[#757575]" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* Service Type Filter */}
                <div>
                  <label className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] mb-3 block">
                    Service Type
                  </label>
                  <select
                    value={filters.service}
                    onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  >
                    <option value="all">All Services</option>
                    <option value="Wash">Wash</option>
                    <option value="Fold">Fold</option>
                    <option value="Wash & Dry">Wash & Dry</option>
                    <option value="Dry">Dry</option>
                    <option value="Full Service">Full Service</option>
                  </select>
                </div>

                {/* Payment Method Filter (only for Paid tab) */}
                {currentTab === "paid" && (
                  <div>
                    <label className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] mb-3 block">
                      Payment Method
                    </label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                    >
                      <option value="all">All Methods</option>
                      <option value="Cash">Cash</option>
                      <option value="GCash">GCash</option>
                    </select>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleResetFilter}
                    className="flex-1 bg-white border-2 border-[#E5E7EB] h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-[#757575] text-[14px] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilter}
                    className="flex-1 bg-gradient-to-r from-[#20a9ea] via-[#118cc6] to-[#006c9f] h-[48px] rounded-[12px] font-['Poppins:SemiBold',sans-serif] text-white text-[14px] border-none cursor-pointer hover:shadow-[0_4px_12px_rgba(17,140,198,0.35)] transition-all"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </MobileContainer>
  );
}
