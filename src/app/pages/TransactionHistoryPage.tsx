import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { MobileContainer } from "../components/MobileContainer";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { BottomNav } from "../components/dashboard/BottomNav";
import { SideMenu } from "../components/dashboard/SideMenu";
import { TransactionTableRow } from "../components/history/TransactionTableRow";
import { TransactionDetailsModal, Transaction } from "../components/history/TransactionDetailsModal";
import { TransactionStatus } from "../components/history/StatusBadge";

// Mock transaction data
const mockTransactions: Transaction[] = [
  { id: 1, invoice: "T01", date: "2026-01-26", amount: 250, status: "ON-GOING", customer: "JUAN DELA CRUZ", service: "WASH & DRY", paymentMethod: "CASH", notes: "Priority order" },
  { id: 2, invoice: "T02", date: "2026-02-26", amount: 350, status: "COMPLETED", customer: "MARIA SANTOS", service: "FULL SERVICE", paymentMethod: "GCASH" },
  { id: 3, invoice: "T03", date: "2026-01-26", amount: 100, status: "ON-GOING", customer: "PEDRO GARCIA", service: "WASH", paymentMethod: "CASH" },
  { id: 4, invoice: "T04", date: "2026-04-26", amount: 200, status: "CANCELLED", customer: "ROSA CRUZ", service: "DRY", paymentMethod: "CARD", notes: "Customer request" },
  { id: 5, invoice: "T05", date: "2026-05-26", amount: 150, status: "COMPLETED", customer: "ALICE REYES", service: "FOLD", paymentMethod: "CASH" },
  { id: 6, invoice: "T06", date: "2026-03-15", amount: 400, status: "COMPLETED", customer: "JOSE LOPEZ", service: "WASH & FOLD", paymentMethod: "GCASH" },
  { id: 7, invoice: "T07", date: "2026-03-14", amount: 175, status: "ON-GOING", customer: "ANA MARTINEZ", service: "DRY", paymentMethod: "CASH" },
  { id: 8, invoice: "T08", date: "2026-03-13", amount: 300, status: "COMPLETED", customer: "CARLOS RAMOS", service: "WASH", paymentMethod: "CARD" },
  { id: 9, invoice: "T09", date: "2026-03-12", amount: 225, status: "CANCELLED", customer: "LINDA TORRES", service: "FULL SERVICE", paymentMethod: "GCASH", notes: "Duplicate order" },
  { id: 10, invoice: "T10", date: "2026-03-11", amount: 125, status: "COMPLETED", customer: "MARCO DELA CRUZ", service: "WASH", paymentMethod: "CASH" },
  { id: 11, invoice: "T11", date: "2026-03-10", amount: 450, status: "ON-GOING", customer: "SOFIA REYES", service: "FULL SERVICE", paymentMethod: "CARD" },
  { id: 12, invoice: "T12", date: "2026-03-09", amount: 180, status: "COMPLETED", customer: "ANTONIO GARCIA", service: "WASH & DRY", paymentMethod: "GCASH" },
  { id: 13, invoice: "T13", date: "2026-03-08", amount: 210, status: "COMPLETED", customer: "ELENA SANTOS", service: "FOLD", paymentMethod: "CASH" },
  { id: 14, invoice: "T14", date: "2026-03-07", amount: 320, status: "ON-GOING", customer: "RAFAEL CRUZ", service: "WASH & FOLD", paymentMethod: "CARD" },
  { id: 15, invoice: "T15", date: "2026-03-06", amount: 275, status: "COMPLETED", customer: "CARMEN REYES", service: "FULL SERVICE", paymentMethod: "CASH" },
  { id: 16, invoice: "T16", date: "2026-03-05", amount: 95, status: "CANCELLED", customer: "DIEGO LOPEZ", service: "DRY", paymentMethod: "GCASH", notes: "Out of service area" },
  { id: 17, invoice: "T17", date: "2026-03-04", amount: 385, status: "COMPLETED", customer: "ISABEL MARTINEZ", service: "WASH & DRY", paymentMethod: "CARD" },
  { id: 18, invoice: "T18", date: "2026-03-03", amount: 140, status: "ON-GOING", customer: "GABRIEL RAMOS", service: "WASH", paymentMethod: "CASH" },
  { id: 19, invoice: "T19", date: "2026-03-02", amount: 260, status: "COMPLETED", customer: "LUCIA TORRES", service: "FOLD", paymentMethod: "GCASH" },
  { id: 20, invoice: "T20", date: "2026-03-01", amount: 420, status: "COMPLETED", customer: "MIGUEL DELA CRUZ", service: "FULL SERVICE", paymentMethod: "CARD" },
];

type SortField = "invoice" | "date" | "amount" | "status";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

export function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "sales" | "history" | "inventory" | "profile">("history");
  
  // State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">("ALL");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleNavigation = (tab: "home" | "sales" | "history" | "inventory" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") {
      navigate("/dashboard");
    } else if (tab === "sales") {
      navigate("/sales-report");
    } else if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "inventory") {
      navigate("/inventory");
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...mockTransactions];

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "amount") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [statusFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };

  const handleFilterByStatus = (status: TransactionStatus | "ALL") => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page
    setShowFilterMenu(false);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

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
          <div className="px-6 pt-4 pb-4 bg-white mb-2">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#3878c2] text-[16px] leading-[24px]">
              Welcome back, User
            </p>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[#3878c2] text-[24px] leading-[32px]">
              Transaction History
            </h1>
          </div>

          {/* Sort and Filter Controls */}
          <div className="px-6 py-4 bg-white mb-2 flex items-center gap-3">
            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="bg-[#3878c2] flex items-center gap-2 h-[32px] px-[12px] py-[6px] rounded-[4px] border-none cursor-pointer hover:opacity-90"
              >
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[12px] text-white whitespace-nowrap">
                  SORT BY
                </p>
                <ChevronDown className="size-[16px]" color="white" strokeWidth={2} />
              </button>

              {/* Sort Dropdown */}
              {showSortMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e2e6] rounded shadow-lg z-10 min-w-[150px]">
                  <button 
                    onClick={() => handleSort("invoice")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Invoice {sortField === "invoice" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("date")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("amount")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button 
                    onClick={() => handleSort("status")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    By Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`${statusFilter !== "ALL" ? 'bg-[#4bad40]' : 'bg-[#3878c2]'} flex items-center gap-2 h-[32px] px-[12px] py-[6px] rounded-[4px] border-none cursor-pointer hover:opacity-90`}
              >
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[12px] text-white whitespace-nowrap">
                  {statusFilter === "ALL" ? "ALL STATUS" : statusFilter}
                </p>
                <ChevronDown className="size-[16px]" color="white" strokeWidth={2} />
              </button>

              {/* Filter Dropdown */}
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e2e6] rounded shadow-lg z-10 min-w-[140px]">
                  <button 
                    onClick={() => handleFilterByStatus("ALL")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    All Status {statusFilter === "ALL" && "✓"}
                  </button>
                  <button 
                    onClick={() => handleFilterByStatus("ON-GOING")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    On-going {statusFilter === "ON-GOING" && "✓"}
                  </button>
                  <button 
                    onClick={() => handleFilterByStatus("COMPLETED")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    Completed {statusFilter === "COMPLETED" && "✓"}
                  </button>
                  <button 
                    onClick={() => handleFilterByStatus("CANCELLED")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[12px] border-none bg-transparent cursor-pointer"
                  >
                    Cancelled {statusFilter === "CANCELLED" && "✓"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Table */}
          <div className="px-6 py-4 bg-white mb-2">
            <div className="mb-3">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[12px]">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} transactions
              </p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[0.8fr_0.9fr_0.8fr_1fr_0.7fr] gap-2 pb-3 border-b-2 border-[#3878c2]">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[10px]">
                INVOICE
              </p>
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[10px]">
                DATE
              </p>
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[10px]">
                AMOUNT
              </p>
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[10px]">
                STATUS
              </p>
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[#002540] text-[10px]">
                ACTION
              </p>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col">
              {currentPageData.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-['Inter:Regular',sans-serif] text-[#ababab] text-[12px]">
                    No transactions found
                  </p>
                </div>
              ) : (
                currentPageData.map((transaction) => (
                  <TransactionTableRow
                    key={transaction.id}
                    invoice={transaction.invoice}
                    date={transaction.date}
                    amount={transaction.amount}
                    status={transaction.status}
                    onDetails={() => handleViewDetails(transaction)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-white mb-2">
              <div className="flex items-center justify-center gap-2">
                {/* Back Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 rounded-[4px] font-['Inter:Medium',sans-serif] text-[12px] border-none cursor-pointer ${
                    currentPage === 1
                      ? 'bg-[#e0e2e6] text-[#ababab] cursor-not-allowed'
                      : 'bg-[#f5f5f5] text-[#3a3e44] hover:bg-[#e0e2e6]'
                  }`}
                >
                  <ChevronLeft className="size-[14px]" strokeWidth={2} />
                  <span>Back</span>
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[36px] h-[36px] px-2 rounded-[4px] font-['Inter:Semi_Bold',sans-serif] text-[12px] border-none cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#3878c2] text-white'
                        : 'bg-[#f5f5f5] text-[#3a3e44] hover:bg-[#e0e2e6]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 rounded-[4px] font-['Inter:Medium',sans-serif] text-[12px] border-none cursor-pointer ${
                    currentPage === totalPages
                      ? 'bg-[#e0e2e6] text-[#ababab] cursor-not-allowed'
                      : 'bg-[#f5f5f5] text-[#3a3e44] hover:bg-[#e0e2e6]'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="size-[14px]" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab={activeTab}
          onTabChange={handleNavigation}
        />

        {/* Transaction Details Modal */}
        <TransactionDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          transaction={selectedTransaction}
        />
      </div>
    </MobileContainer>
  );
}