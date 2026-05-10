import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../components/MobileContainer";
import { BottomNav } from "../components/dashboard/BottomNav";
import { Bell, Menu, Filter, ChevronDown, ChevronRight, ChevronLeft, X, Home, History, TrendingUp, Package, Settings, LogOut } from "lucide-react";

interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  date: string;
  time: string;
  status: "Completed" | "On-going" | "Canceled";
  services: string[];
}

const transactions: Transaction[] = [
  { id: "1", invoice: "T01", customer: "Juan Dela Cruz", date: "01-01-26", time: "1:00 PM", status: "Completed", services: ["Dry", "Wash"] },
  { id: "2", invoice: "T02", customer: "Maria Santos", date: "01-02-26", time: "2:30 PM", status: "On-going", services: ["Wash", "Fold"] },
  { id: "3", invoice: "T03", customer: "Pedro Garcia", date: "01-03-26", time: "10:15 AM", status: "Canceled", services: ["Full Service"] },
  { id: "4", invoice: "T04", customer: "Alice Reyes", date: "01-04-26", time: "3:45 PM", status: "Completed", services: ["Dry"] },
  { id: "5", invoice: "T05", customer: "Jose Lopez", date: "01-05-26", time: "11:00 AM", status: "Completed", services: ["Wash", "Dry"] },
  { id: "6", invoice: "T06", customer: "Ana Martinez", date: "01-06-26", time: "4:20 PM", status: "On-going", services: ["Fold"] },
  { id: "7", invoice: "T07", customer: "Carlos Ramos", date: "01-07-26", time: "9:30 AM", status: "Completed", services: ["Wash"] },
];

export function StaffTransactionHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("history");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"date-newest" | "date-oldest" | "name-az" | "name-za">("date-newest");
  const [filters, setFilters] = useState({
    status: "all",
  });

  const handleTabChange = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigate("/staff-dashboard");
    else if (tab === "sales") navigate("/staff-sales-report");
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

  const getStatusColor = (status: string) => {
    if (status === "Completed") return "bg-[#4BAD40]/10 text-[#4BAD40]";
    if (status === "On-going") return "bg-[#F59E0B]/10 text-[#F59E0B]";
    if (status === "Canceled") return "bg-[#EF4444]/10 text-[#EF4444]";
    return "";
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleApplySort = (sortOption: typeof sortBy) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
  };

  const handleApplyFilter = () => {
    setShowFilterModal(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleResetFilter = () => {
    setFilters({
      status: "all",
    });
  };

  const applySortAndFilter = (data: Transaction[]) => {
    // Apply filters
    let filtered = data.filter(transaction => {
      if (filters.status !== "all" && transaction.status !== filters.status) return false;
      return true;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return b.id.localeCompare(a.id); // Assuming higher ID = newer
        case "date-oldest":
          return a.id.localeCompare(b.id);
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

  const filteredTransactions = applySortAndFilter(transactions);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

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
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[#14px]">
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
                Transaction History
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6 space-y-5">
            {/* Filter / Action Row */}
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
                      onClick={() => handleApplySort("name-az")}
                      className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                        sortBy === "name-az" ? "bg-[#F0F9FF]" : ""
                      }`}
                    >
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                        Customer: A–Z
                      </span>
                    </button>
                    <button
                      onClick={() => handleApplySort("name-za")}
                      className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-none cursor-pointer ${
                        sortBy === "name-za" ? "bg-[#F0F9FF]" : ""
                      }`}
                    >
                      <span className="font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px]">
                        Customer: Z–A
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Table Header */}
              <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
                <div className="grid grid-cols-[1fr_1.2fr_1.5fr_0.5fr] gap-3">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                    Invoice
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                    Date
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase">
                    Status
                  </p>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[11px] uppercase text-right">
                    Details
                  </p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#E5E7EB]">
                {currentTransactions.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[14px]">
                      No transactions found
                    </p>
                  </div>
                ) : (
                  currentTransactions.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      className="w-full px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-[#F9FAFB] transition-colors text-left"
                    >
                    <div className="grid grid-cols-[1fr_1.2fr_1.5fr_0.5fr] gap-3 items-center">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[13px]">
                        {transaction.invoice}
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[#757575] text-[13px]">
                        {transaction.date}
                      </p>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px] ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <ChevronRight className="w-5 h-5 text-[#757575]" />
                      </div>
                    </div>
                  </button>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="px-4 py-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[8px] font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].slice(0, totalPages).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-[8px] font-['Poppins:SemiBold',sans-serif] text-[13px] border-none cursor-pointer transition-colors ${
                          currentPage === page
                            ? "bg-[#3878c2] text-white"
                            : "bg-white text-[#757575] border border-[#E5E7EB]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[8px] font-['Poppins:Medium',sans-serif] text-[#1e1e1e] text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Transaction Details Modal */}
        {/* Transaction Details Modal */}
        {showDetailsModal && selectedTransaction && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetailsModal(false)}
            />

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-4px_12px_rgba(0,0,0,0.15)] z-50 animate-slideUp max-w-[430px] mx-auto">
              <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
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

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-1 uppercase">
                      Invoice
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px]">
                      {selectedTransaction.invoice}
                    </p>
                  </div>

                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-1 uppercase">
                      Customer
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px]">
                      {selectedTransaction.customer}
                    </p>
                  </div>

                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-1 uppercase">
                      Status
                    </p>
                    <span className={`inline-block px-3 py-1.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[12px] ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-1 uppercase">
                        Date
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px]">
                        {selectedTransaction.date}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-1 uppercase">
                        Time
                      </p>
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[16px]">
                        {selectedTransaction.time}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[#757575] text-[12px] mb-2 uppercase">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTransaction.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1.5 rounded-full bg-[#3878c2]/10 text-[#3878c2] font-['Poppins:SemiBold',sans-serif] text-[12px]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
                {/* Status Filter */}
                <div>
                  <label className="font-['Poppins:SemiBold',sans-serif] text-[#1e1e1e] text-[14px] mb-3 block">
                    Transaction Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-[12px] border-2 border-[#E5E7EB] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#3878c2] transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="On-going">On-going</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

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
      </div>
    </MobileContainer>
  );
}
