// assets/dummyStyles.js

export const dashboardStyles = {
  // Layout styles
  container: "min-h-screen p-4 md:p-6",

  headerContainer:
    "bg-gradient-to-r from-teal-200 to-cyan-200 rounded-lg md:rounded-xl p-4 sm:p-6 -mx-2 sm:-mx-7 overflow-x-hidden mb-6 md:mb-8 border border-blue-300 shadow-lg shadow-blue-100",
  headerContent:
    "flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 mb-8",
  headerTitle:
    "text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent",
  headerSubtitle: "text-gray-600 mt-2 text-sm sm:text-base",

  // Button styles
  addButton:
    "flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all shadow hover:shadow-md font-medium cursor-pointer text-sm sm:text-base",
  timeFrameContainer:
    "flex px-10 -mx-14 justify-center lg:-mx-0 md:-mx-0 lg:justify-end md:justify-end mt-4",
  timeFrameWrapper:
    "flex gap-0 bg-white p-1 -mx-5 rounded-xl border border-gray-200",
  timeFrameButton: (isActive) =>
    `px-2.5 py-2 text-sm rounded-lg transition-all ${
      isActive
        ? "bg-teal-500 text-white"
        : "text-gray-600 hover:bg-gray-100 cursor-pointer"
    }`,

  // Summary cards grid
  summaryGrid:
    "grid grid-cols-1 p-1 lg:-mx-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8",

  // Financial card styles
  balanceBadge: "bg-teal-100 text-teal-800 px-2 py-1 rounded-lg text-xs",
  expenseBadge: "bg-orange-100 text-orange-800 px-1 py-1 rounded-lg text-xs",

  // Gauge container styles
  gaugeGrid:
    "grid grid-cols-1 -mx-5 xl:-mx-5 md:grid-cols-3 md:gap-13 lg:gap-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8",

  // Pie chart container styles
  pieChartContainer:
    " hidden sm:block bg-white lg:-mx-5.5 md:-mx-4 lg:p-1 xl:-mx-3 rounded-lg p-5 shadow-lg shadow-blue-100 border border-blue-300 relative overflow-hidden mb-8",
  pieChartHeader:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3",
  pieChartTitle:
    "text-xl lg:pt-3 xl:pl-3 font-bold text-gray-800 mb-5 flex items-center gap-3",
  pieChartSubtitle:
    "text-sm lg:text-center xl:text-start xl:pl-3 text-gray-500 mb-3",
  pieChartHeight: "h-[300px] xl:h-[320px]",

  // Pie chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "12px",
  },
  tooltipItem: { fontWeight: 400 },

  // Legend styles
  legendWrapper: { paddingTop: 8 },
  legendText: "text-sm font-medium text-gray-600",

  // Income/Expense lists grid
  listsGrid: "grid grid-cols-1 gap-6",

  // List container styles
  listContainer:
    "bg-white rounded-xl lg:p-5 md:p-6 mx-0 md:-mx-3 shadow-lg border border-blue-300 shadow-blue-100",
  listHeader:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3",
  listTitle:
    "text-xl font-bold text-gray-800 md:mt-3 mt-3 flex items-center gap-3",
  listSubtitle: "text-sm text-gray-500 font-normal",

  // Record count badges
  incomeCountBadge:
    "text-sm bg-green-100 px-2 mx-2 text-green-800 md:mx-2 md:mt-2 py-1 rounded-full",
  expenseCountBadge:
    "text-sm bg-orange-100 text-orange-800 px-2 mx-2 md:mx-2 md:mt-2 py-1 rounded-full",

  // Transaction item styles
  transactionList: "space-y-3",
  incomeTransactionItem:
    "flex items-center px-2 mx-2 my-2 md:p-4 md:mx-2 lg:px-3 justify-between p-3 bg-green-50 rounded-lg",
  expenseTransactionItem:
    "flex items-center justify-between mx-1 p-3 lg:p-3 md:p-4 md:mx-2 bg-orange-50 rounded-lg",

  // Transaction icon container
  incomeIconContainer: "p-2 bg-green-100 rounded-lg",
  expenseIconContainer: "p-2 bg-orange-100 rounded-lg",

  // Transaction content
  transactionContent: "flex items-center lg:gap-3 md:gap-3 gap-1",
  transactionDescription: "font-medium text-gray-800",
  transactionCategory: "text-sm text-gray-500",
  transactionAmount: "text-right",
  incomeAmount: "font-bold text-green-600",
  expenseAmount: "font-bold text-orange-600",
  transactionDate: "text-sm text-gray-500",

  // Empty state styles
  emptyState: "text-center py-8",
  emptyIconContainer: (color) =>
    `w-16 h-16 mx-auto mb-4 rounded-full ${color} flex items-center justify-center`,
  emptyText: "text-gray-600 font-medium",

  // View all button styles
  viewAllContainer: "pt-4 border-t border-gray-100",
  viewAllButton:
    "w-full flex items-center justify-center gap-2 py-3 text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-colors",

  // Icon container styles
  iconContainer: (color) => `p-2 ${color} rounded-lg`,

  // Specific icon colors
  walletIconContainer: "p-2 bg-teal-100 rounded-lg",
  arrowDownIconContainer: "p-2 bg-orange-100 rounded-lg",
  piggyBankIconContainer: "p-2 bg-cyan-100 rounded-lg",
};

// Additional styles for financial trends
export const trendStyles = {
  positive: "text-orange-600",
  negative: "text-green-600",
  positiveRate: "bg-teal-100 text-teal-700",
  negativeRate: "bg-red-100 text-red-700",
};

// Chart specific styles
export const chartStyles = {
  pieChart: "lg:-px-5 lg:text-xs xl:text-xl",
};

// Add to existing dummyStyles.js
export const incomeStyles = {
  // Layout
  wrapper: "space-y-4 md:space-y-6 p-3 md:p-4 max-w-7xl mx-auto",
  headerContainer:
    "bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg md:rounded-xl p-4 -mx-7 lg:-mx-7 overflow-x-hidden md:p-6 mb-6 md:mb-8 border border-blue-300 shadow-lg shadow-blue-100",
  header:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6",
  headerTitle: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-800",
  headerSubtitle: "text-gray-600 mt-1 text-sm md:text-base",
  addButton:
    "flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm md:text-base cursor-pointer",

  // Summary Cards
  summaryGrid:
    "grid grid-cols-1 -mx-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5",

  // Chart
  chartContainer:
    "hidden md:block -mx-7 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg p-6 shadow-lg shadow-blue-200 border border-blue-300",
  chartTitle:
    "text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",

  // Transaction List
  listContainer:
    "bg-white rounded-xl -mx-7 md:rounded-xl p-4 md:p-6 shadow-sm border border-blue-300 relative overflow-hidden",
  sectionTitle:
    "text-lg md:text-xl font-bold text-teal-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",

  // Filter Section
  filterContainer: "flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto",
  filterSelect:
    "appearance-none bg-white border border-blue-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full cursor-pointer",
  exportButton:
    "flex items-center justify-center gap-1 bg-white border border-blue-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-all text-sm hover:shadow-md w-full sm:w-auto cursor-pointer",

  // Transaction Items
  transactionList: "space-y-3 -mx-3 lg:mx-0 md:mx-0",
  viewAllButton:
    "mt-4 w-full text-center py-3 text-green-600 font-medium hover:bg-green-100 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer",

  // Empty State
  emptyStateContainer: "text-center py-6 md:py-8",
  emptyStateIcon:
    "w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-green-50 flex items-center justify-center",
  emptyStateText: "text-gray-600 font-medium text-sm md:text-base",
  emptyStateSubtext: "text-xs md:text-sm text-gray-500 mt-1 md:mt-2",
  emptyStateButton:
    "mt-3 md:mt-4 flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg mx-auto text-sm md:text-base",

  // Time Frame Selector Container
  timeFrameContainer:
    "flex px-10 -mx-14 justify-center lg:-mx-0 md:-mx-0 lg:justify-end md:justify-end mt-4",

  // Chart header container
  chartHeaderContainer:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5",

  // Chart height
  chartHeight: "h-64 md:h-80",

  // Chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "12px",
    backdropFilter: "blur(4px)",
  },

  // Icon container styles for summary cards
  iconGreen: "p-2 bg-green-100 rounded-lg",
  iconBlue: "p-2 bg-blue-100 rounded-lg",
  iconPurple: "p-2 bg-purple-100 rounded-lg",

  borderGreen: "border-l-4 border-Green-500",
  borderPurple: "border-l-4 border-Purple-500",
  borderRose: "border-l-4 border-Rose-800",

  // Icon text colors
  textGreen: "text-green-600",
  textBlue: "text-blue-600",
  textPurple: "text-purple-600",

  // Filter icon positioning
  filterIcon:
    "absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none",

  // FinancialCard border colors (if needed, similar to expense page)
  borderGreen: "border-l-4 border-green-500",
  borderBlue: "border-l-4 border-blue-500",
  borderPurple: "border-l-4 border-purple-500",
};

export const expensePageStyles = {
  // Main container
  container: "space-y-6 max-w-7xl",

  // Header card
 headerCard:
    "bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg p-5 sm:p-7 -mx-2 sm:-mx-0 mb-6 border border-blue-300 shadow-lg shadow-blue-100",
  headerContainer:
    "flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6",
  headerTitle: "text-xl sm:text-2xl md:text-3xl font-bold text-gray-800",
  headerSubtitle: "text-gray-600 mt-1 text-sm sm:text-base",
  addButton:
    "flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-medium cursor-pointer text-sm sm:text-base",
  cardsGrid:
    "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5",

  // Chart container
  chartContainer:
    "hidden md:block bg-gradient-to-r from-red-50 to-orange-200 rounded-lg p-4 -mx-7 lg:-mx-0 shadow-sm border border-blue-300",
  chartHeader:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5",
  chartTitle: "text-xl font-bold text-gray-800 mb-5 flex items-center gap-3",
  exportButton:
    "flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all text-sm hover:shadow-md cursor-pointer cursor-pointer",
  chart: "h-80",

  // Transactions container
  transactionsContainer:
    "bg-white rounded-lg p-5 -mx-4 lg:-mx-0 md:-mx-5 shadow-lg shadow-blue-200 border border-blue-300 relative overflow-hidden",
  transactionsHeader:
    "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-5",
  transactionsTitle:
    "text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 flex items-center gap-2 md:gap-3",
  filterSelect:
    "appearance-none bg-white border border-blue-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full cursor-pointer",

  // Transaction items
  transactionsList: "space-y-3 -mx-2 lg:-mx-0 md:-mx-0",
  viewAllButton:
    "mt-4 w-full text-center py-3 text-orange-600 font-medium hover:bg-amber-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer",
  emptyState: "text-center py-8 flex flex-col items-center gap-4",
  emptyStateIcon:
    "w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 ",
  emptyStateText: "text-gray-600 font-medium",
  emptyStateSubtext: "text-sm text-gray-500 mt-2",

  // Icons
  iconOrange: "p-2 bg-orange-100 rounded-lg",
  iconAmber: "p-2 bg-amber-100 rounded-lg",
  iconYellow: "p-2 bg-yellow-100 rounded-lg",
  textOrange: "text-orange-600",
  textAmber: "text-amber-600",
  textYellow: "text-yellow-600",

  // Borders
  borderOrange: "border-l-4 border-orange-500",
  borderAmber: "border-l-4 border-amber-500",
  borderYellow: "border-l-4 border-yellow-500",
  // Chart tooltip styles
  tooltipContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "12px",
    backdropFilter: "blur(4px)",
  },

  // Chart height style
  chartHeight: "h-80",

  // Export button for chart header (different from existing exportButton)
  chartExportButton:
    "flex items-center gap-1 bg-white border border-blue-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all text-sm hover:shadow-md",

  // Additional empty state style
  emptyStateSubtext: "text-sm text-gray-500 mt-2",

  // Timeframe positioning
  timeframePositioning:
    "flex px-10 -mx-14 justify-center lg:-mx-0 md:-mx-0 lg:justify-end md:justify-end mt-4",

  // Transaction item specific styles
  transactionItemContainer:
    "flex items-center justify-between p-3 -mx-2 hover:bg-amber-50 rounded-xl transition-all duration-300 border border-gray-100 cursor-pointer mb-3 group",
  transactionAmount: "font-bold",
  transactionIcon: "lg:p-3 md:p-3 p-1 rounded-lg",
};

export const profileStyles = {
  // Container styles
  container: "max-w-4xl mx-auto py-8 px-4",
  mainContainer:
    "bg-white -mx-7 rounded-xl shadow-sm overflow-hidden border border-blue-300",

  // Header styles
  header:
    "hidden sm:block bg-gradient-to-r from-teal-500 to-emerald-600 p-2 text-center py-12",
  avatar:
    "block w-44 h-44 mx-auto rounded-full flex items-center justify-center",
  userName: "text-5xl font-bold text-white mx-48",
  userEmail: "text-teal-100 mt-2 mx-48",

  // Content styles
  content: "p-8 -mx-6.5",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8",

  // Card styles
  card: "bg-blue-50 rounded-lg p-6 border border-blue-100",
  cardTitle: "text-xl font-semibold pb-3 text-black flex items-center",
  icon: "w-5 h-5 mr-2 text-teal-600",

  // Form styles
  label: "text-sm text-gray-500  block mb-1",
  input:
    "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500 ",
  inputWithError:
    "w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-500",

  // Button styles
  buttonPrimary:
    "flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium shadow-md cursor-pointer",
  buttonSecondary:
    "flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 cursor-pointer",
  editButton:
    "text-teal-600 hover:text-teal-700 font-medium text-sm cursor-pointer",
  changeButton:
    "text-teal-600 hover:text-teal-700 font-medium lg:text-sm cursor-pointer",

  // Security item
  securityItem:
    "flex items-center justify-between p-4 bg-white rounded-lg border border-blue-300",
  securityText: "font-medium lg:text-sm text-gray-400",

  // Modal styles
  modalContent: "bg-white rounded-2xl p-6 lg:px-28 w-full max-w-md",
  modalHeader: "flex justify-between lg:whitespace-nowrap lg:space-x-20 mb-6",
  modalTitle: "text-xl font-bold lg:pl-10 text-gray-800",

  // Password input
  passwordLabel: "block text-sm font-medium text-gray-700 mb-1",
  passwordContainer: "relative",
  passwordToggle:
    "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 ",

  // Error text
  errorText: "mt-1 text-sm text-red-600",
};

// Add to existing dummyStyles.js
export const modalStyles = {
  // Modal container
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50",
  modalContainer: "bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl",
  modal: "bg-white p-5 rounded-xl w-96",
  
  // Header
  modalHeader: "flex justify-between items-center mb-4",
  modalTitle: "text-xl font-bold text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-800",
  
  // Form elements
  form: "space-y-4",
  label: "block text-sm font-medium text-gray-700 mb-1",
  input: (ringColor) => `w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${ringColor}`,
  
  // Type buttons
  typeButtonContainer: "flex gap-4",
  typeButton: (isSelected, color) => 
    `flex-1 py-2 rounded-lg font-medium ${
      isSelected 
        ? `${color} text-white shadow-md` 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`,
  
  // Submit button
  submitButton: (color) => `w-full text-white py-3 rounded-lg font-medium mt-4 shadow-md hover:shadow-lg transition-all ${color}`,
  
  // Color classes
  colorClasses: {
    teal: {
      button: "bg-teal-500 hover:bg-teal-600",
      ring: "focus:ring-teal-500",
      typeButtonSelected: "bg-teal-500",
    },
    orange: {
      button: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
      ring: "focus:ring-orange-500",
      typeButtonSelected: "bg-orange-500",
    },
  },
};



// In src/assets/dummyStyles.js - add these styles
export const loginStyles = {
  // Page container
  pageContainer:
    "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50",

  // Card container
  cardContainer:
    "w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden",

  // Header styles
  header: "bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-center",
  avatar:
    "w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4",
  headerTitle: "text-2xl font-bold text-white",
  headerSubtitle: "text-teal-100 mt-2",

  // Form container
  formContainer: "p-8",

  // Error message
  errorContainer:
    "mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-center",
  errorIcon:
    "w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3",
  errorText: "break-words",

  // Form elements
  label: "block text-sm font-medium text-gray-700 mb-2",
  inputContainer: "relative",
  inputIcon:
    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400",
  input:
    "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500",
  passwordInput:
    "w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500",
  passwordToggle:
    "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600",

  // Checkbox
  checkboxContainer: "mb-6 flex items-center",
  checkbox:
    "w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer",
  checkboxLabel: "ml-2 z-20 block text-sm text-gray-700 cursor-pointer",

  // Button
  button:
    "w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer",
  buttonDisabled: "opacity-80 cursor-not-allowed",

  // Sign up link
  signUpContainer: "mt-8 text-center",
  signUpText: "text-gray-600",
  signUpLink: "font-medium text-teal-600 hover:underline",

  // Spinner for loading state
  spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
};

// Styles for Navbar component
export const navbarStyles = {
  // Layout and container styles
  header:
    "sticky top-0 z-50 bg-gradient-to-r from-white to-olive-200 border-b border-gray-100 shadow-sm",
  container:
    "flex items-center justify-between px-4 py-2 md:px-8 max-w-7xl mx-auto ",

  // Logo styles
  logoContainer: "flex items-center gap-0 cursor-pointer",
  logoImage: "w-15 h-15 rounded-xl overflow-hidden",

  // Text styles
  logoText:
    "lg:text-3xl md:text-3xl text-2xl text-gray-900 font-[550] lobster-regular",

  // User profile styles
  userContainer: "relative",
  userButton:
    "flex items-center gap-2 px-4.5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer",
  userAvatar:
    "w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-white font-bold text-lg",
  statusIndicator:
    "absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white",
  userTextContainer: "text-left hidden md:block",
  userName: "text-sm font-medium text-gray-800 truncate max-w-[120px]",
  userEmail: "text-xs text-gray-500 truncate max-w-[120px]",
  chevronIcon: (isOpen) =>
    `w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`,

  // Dropdown menu styles
  dropdownMenu:
    "absolute top-14 right-0 w-56 bg-gradient-to-r from-green-50 to-pink-100 rounded-lg shadow-lg border border-gray-100 z-50",
  dropdownHeader: "px-4 py-3 border-b border-gray-100",
  dropdownAvatar:
    "w-12 h-12 p-5 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg",
  dropdownName: "text-sm text-gray-800 ",
  dropdownEmail: "text-xs text-gray-500 truncate max-w-[120px]",

  // Menu items
  menuItemContainer: "p-2",
  menuItem:
    "w-full px-4 py-3 text-left hover:bg-blue-100 text-sm text-black flex items-center gap-3 rounded-lg cursor-pointer",
  menuItemBorder: "p-2 border-t border-blue-300",
  logoutButton:
    "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-red-100 text-red-600 rounded-lg cursor-pointer",
};


// In src/assets/dummyStyles.js - add these styles
export const signupStyles = {
  // Page container (reusing from login)
  pageContainer:
    "min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-teal-50 to-emerald-50",

  // Card container (reusing from login)
  cardContainer:
    "w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden",

  // Header styles (reusing from login with additions)
  header:
    "bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-center relative",
  avatar:
    "w-18 h-18 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2",
  headerTitle: "text-2xl font-bold text-white",
  headerSubtitle: "text-teal-100 mt-2",
  backButton:
    "absolute top-4 left-4 p-2 text-white rounded-full hover:bg-white/10 transition-colors",

  // Form container (reusing from login)
  formContainer: "p-8",

  // Error messages
  apiError: "mb-4 text-center text-sm text-red-600",
  fieldError: "mt-1 text-sm text-red-600",

  // Form elements (reusing from login with additions)
  label: "block text-sm font-medium text-gray-700 mb-2",
  inputContainer: "relative",
  inputIcon:
    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400",
  input:
    "w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500",
  passwordInput:
    "w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500",
  passwordToggle:
    "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600",

  // Checkbox (reusing from login)
  checkboxContainer: "mb-6 flex items-center",
  checkbox:
    "w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer",
  checkboxLabel: "ml-2 z-20 block text-sm text-gray-700 cursor-pointer",

  // Button (reusing from login)
  button:
    "w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer",
  buttonDisabled: "opacity-80 cursor-not-allowed",

  // Sign in link (reusing from login with modifications)
  signInContainer: "mt-2 text-center",
  signInText: "text-gray-600",
  signInLink: "font-medium text-teal-600 hover:underline",

  // Spinner for loading state (reusing from login)
  spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
};

export const transactionItemStyles = {
  // Container styles
  container: (isEditing, classes) =>
    `flex flex-col md:flex-row items-stretch justify-between gap-3 p-4 rounded-lg border border-gray-100 mb-3 last:mb-0 ${isEditing ? classes.bg : "hover:bg-blue-50"}`,

  // Layout styles
  mainContainer: "flex items-center gap-3 flex-1 min-w-0",
  actionsContainer: "flex items-center justify-between gap-3 mt-2 md:mt-0",
  amountContainer: "min-w-[100px] flex-shrink-0 flex justify-end",
  buttonsContainer: "flex gap-1 flex-shrink-0",

  // Icon styles
  iconContainer: (iconClass, classes) => `${iconClass} ${classes.iconBg}`,

  // Content styles
  contentContainer: "min-w-0 flex-1",
  description: "font-medium text-gray-800 truncate",
  details: "text-xs text-gray-500 mt-1 truncate",

  // Input styles
  input: (hasError, classes) =>
    `w-full bg-white rounded-lg p-3 mt-5 focus:outline-none focus:ring-1 ${hasError ? "border-red-500 ring-red-500" : `${classes.border} ${classes.ring}`}`,
  amountInput: (hasError, classes) =>
    `w-full max-w-[120px] bg-white rounded-lg p-3 focus:outline-none focus:ring-1 ${hasError ? "border-red-500 ring-red-500" : `${classes.border} ${classes.ring}`}`,

  // Error styles
  errorText: "text-xs text-red-600 mt-1",

  // Amount display
  amountText: (amountClass, classes) => `${amountClass} ${classes.text}`,

  // Button styles
  saveButton: (classes) => `p-2 ${classes.button} rounded-lg`,
  cancelButton: "p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400",
  editButton: (classes) =>
    `p-2 ${classes.text} cursor-pointer hover:${classes.bg}`,
  deleteButton: (classes) =>
    `p-2 ${classes.text} rounded-lg cursor-pointer hover:${classes.bg}`,
};

// Centralized styles for the application
export const sidebarStyles = {
  // Layout and container styles
  sidebarContainer: {
    base: "hidden lg:flex flex-col pt-3 fixed top-16 bottom-0 z-30",
  },

  sidebarInner: {
    base: "bg-gradient-to-r from-blue-50 to-cyan-200 border-r border-blue-400 shadow-r shadow-blue-200 h-full flex flex-col",
  },

  // User profile section
  userProfileContainer: {
    base: "p-5 border-b pt-20 md:pt-5 lg:pt-5 xl:pt-5 border-gray-100 rounded-full",
    collapsed: "px-3",
    expanded: "px-6",
  },

  userInitials: {
    base: "w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl",
  },

  // Menu items
  menuList: {
    base: "space-y-1 px-2",
  },

  menuItem: {
    base: "relative flex items-center gap-3 py-3 rounded-lg font-medium transition-all duration-200",
    active: "text-black bg-white",
    inactive: "text-black hover:text-teal-700 hover:bg-gray-50",
    collapsed: "justify-center px-0 mx-1",
    expanded: "px-4",
  },

  menuIcon: {
    active: "text-black",
    inactive: "text-gray-600",
  },

  activeIndicator:
    "absolute right-4 w-2 h-2 bg-teal-400 rounded-full animate-ping",

  // Toggle button
  toggleButton: {
    base: "absolute -right-3 top-12 z-20 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-all",
  },

  // Footer section
  footerContainer: {
    base: "border-t border-teal-500 p-4 mt-24",
    collapsed: "px-3",
    expanded: "px-6",
  },

  footerLink: {
    base: "w-full flex items-center px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-teal-700 hover:bg-gray-100 transition-all duration-200",
    expanded: "gap-2",
    collapsed: "justify-center",
  },

  logoutButton: {
    base: "w-full flex items-center px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-100 transition-all duration-200",
    expanded: "gap-2",
    collapsed: "justify-center",
  },
  // Mobile sidebar
  mobileOverlay: "fixed inset-0 z-40 lg:hidden",
  mobileBackdrop: "absolute inset-0 bg-black/30 backdrop-blur-sm",

  mobileSidebar: {
    base: "absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl rounded-r-2xl overflow-hidden",
  },

  mobileHeader:
    "p-6 flex justify-between items-center border-b border-gray-100",
  mobileUserContainer: "flex pt-28 items-center gap-3",
  mobileCloseButton: "p-2 rounded-lg hover:bg-gray-100",

  mobileMenuList: "space-y-1",
  mobileMenuItem: {
    base: "flex items-center gap-4 px-6 py-4 font-medium",
    active: "text-teal-600 bg-teal-50",
    inactive: "text-gray-600 hover:bg-gray-50",
  },

  mobileFooter: "border-t border-gray-100 p-6",
  mobileFooterLink:
    "flex items-center gap-4 py-2 font-medium text-gray-600 hover:text-teal-700",
  mobileLogoutButton:
    "flex items-center gap-4 py-2 font-medium text-gray-600 hover:text-red-600 w-full",

  // Mobile menu button
  mobileMenuButton:
    "lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-full flex items-center justify-center shadow-xl",
};

// Helper function to combine class names
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// assets/dummyStyles.js

export const styles = {
  // Layout and Container Styles
  layout: {
    root: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100",
    mainContainer: (sidebarCollapsed) =>
      `p-4 pt-6 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`,
  },

  // Header Styles
  header: {
    container:
      "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4",
    title: "text-2xl font-bold text-gray-800",
    subtitle: "text-gray-600",
  },

  // Stat Card Styles
  statCards: {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6",
    incomeCard:
      "bg-gradient-to-r from-green-100 to-emerald-200 p-5 rounded-xl shadow-lg hover:shadow-blue-400 border border-blue-300",
    card: "bg-gradient-to-r from-emerald-50 to-teal-200 p-5 rounded-xl shadow-lg hover:shadow-blue-400 border border-blue-300",
    savingCard:
      "bg-gradient-to-r from-purple-50 to-indigo-100 p-5 rounded-xl shadow-lg hover:shadow-blue-400 border border-blue-300",
    expenseCard:
      "bg-gradient-to-r from-red-50 to-orange-300 p-5 rounded-xl shadow-lg hover:shadow-blue-400 border border-blue-300",
    cardHeader: "flex justify-between items-start",
    cardTitle: "text-sm text-black",
    cardValue: "text-2xl font-bold text-teal-800 mt-1",
    iconContainer: (color) => `bg-${color}-100 p-2 rounded-lg`,
    icon: (color) => `w-5 h-5 text-${color}-600`,
    cardFooter: "text-xs text-teal-500 mt-3",
  },

  // Grid Layout
  grid: {
    main: "grid grid-cols-1 lg:grid-cols-3 gap-6",
    leftColumn: "lg:col-span-2 space-y-6",
    rightColumn: "lg:col-span-1 lg:-mx-3 space-y-6",
  },

  // Card Styles
  cards: {
    base: "bg-linear-to-br from-teal-100 to-emerald-200 rounded-xl p-6 shadow-lg shadow-blue-200 border border-blue-300",
    rightBase:
      "bg-gradient-to-r from-white to-olive-200 rounded-xl p-6 shadow-lg shadow-blue-200 border border-blue-300",
    header: "flex justify-between items-center mb-3",
    title: "text-xl font-bold text-black flex items-center gap-3",
    titleIcon: "w-6 h-6",
  },

  // Recent Transactions Card
  transactions: {
    cardHeader: "flex justify-between items-center mb-4",
    cardTitle:
      "text-md md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 flex items-center gap-3",
    refreshButton:
      "p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer",
    refreshIcon: (loading) =>
      `w-5 h-5 text-gray-500 ${loading ? "animate-spin" : ""}`,
    dataStackingInfo:
      "flex items-center gap-2 text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded-lg",
    dataStackingIcon: "w-4 h-4 text-blue-500",
    listContainer: "space-y-4 max-h-[500px] -mx-5 overflow-y-auto pr-2",
    transactionItem:
      "flex items-center ml-2 lg:flex-col xl:flex-row md:flex-row justify-between p-1 -mx-0 lg:p-4 md:p-4 hover:bg-blue-100 rounded-lg transition-all duration-300 border border-black ",
    iconWrapper: (type) =>
      type === "income"
        ? "bg-teal-100 text-teal-600"
        : "bg-orange-100 text-orange-600",
    icon: "w-4 h-4",
    details: "min-w-0",
    description: "font-medium text-gray-800 truncate max-w-[120px]",
    meta: "text-xs text-gray-500 mt-1",
    amount: (type) =>
      `font-semibold ₹{type === "income" ? "text-teal-600" : "text-orange-600"}`,
    emptyState: "text-center py-8",
    emptyIconContainer:
      "w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center",
    emptyIcon: "w-8 h-8 text-purple-500",
    emptyText: "text-gray-600 font-medium",
    viewAllContainer: "pt-4 border-t border-blue-100",
    viewAllButton:
      "w-full flex items-center justify-center gap-2 py-3 text-blue-600 font-medium hover:bg-blue-200 rounded-xl transition-colors cursor-pointer",
  },

  // Spending by Category Card
  categories: {
    title:
      "text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 mb-6 flex items-center gap-3",
    titleIcon: "w-6 h-6 text-cyan-500",
    list: "space-y-4",
    categoryItem:
      "flex items-center md:text-lg lg:text-sm xl:text-lg justify-between",
    categoryIconContainer: "bg-gray-100 p-2 rounded-lg",
    categoryIcon: "w-4 h-4 text-gray-600",
    categoryName: "font-medium text-gray-700",
    categoryAmount: "font-semibold text-gray-800",
    summaryContainer: "mt-6 pt-6 border-t border-gray-100",
    summaryGrid: "grid grid-cols-2 gap-4",
    summaryIncomeCard:
      "bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-black",
    summaryExpenseCard:
      "bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-black",
    summaryTitle: "text-sm text-gray-600",
    summaryValue: "text-sm font-bold text-gray-800",
  },

  // Color Helpers
  colors: {
    transaction: {
      text: (type) => (type === "income" ? "text-teal-600" : "text-orange-600"),
      bg: (type) =>
        type === "income"
          ? "bg-teal-100 text-teal-600"
          : "bg-orange-100 text-orange-600",
    },
    expenseChange: (change) =>
      change > 0 ? "text-orange-600" : "text-green-600",
  },
};