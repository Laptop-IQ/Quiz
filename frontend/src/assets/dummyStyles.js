// assets/dummyStyles.js

// Background image designs for different quiz types
export const backgroundDesigns = {
  tech: {
    pattern: "circuit-board",
    gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
    colorScheme: "blue",
    accentColor: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-300/50",
    textColor: "text-blue-800",
  },
  science: {
    pattern: "microscope",
    gradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
    colorScheme: "emerald",
    accentColor: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-300/50",
    textColor: "text-emerald-800",
  },
  history: {
    pattern: "ancient",
    gradient: "from-amber-500/10 via-orange-500/10 to-rose-500/10",
    colorScheme: "amber",
    accentColor: "from-amber-500 to-orange-400",
    borderColor: "border-amber-300/50",
    textColor: "text-amber-800",
  },
  math: {
    pattern: "geometry",
    gradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
    colorScheme: "purple",
    accentColor: "from-violet-500 to-purple-400",
    borderColor: "border-purple-300/50",
    textColor: "text-purple-800",
  },
  literature: {
    pattern: "book-pages",
    gradient: "from-rose-500/10 via-pink-500/10 to-red-500/10",
    colorScheme: "rose",
    accentColor: "from-rose-500 to-pink-400",
    borderColor: "border-rose-300/50",
    textColor: "text-rose-800",
  },
  default: {
    pattern: "abstract",
    gradient: "from-indigo-500/10 via-blue-500/10 to-purple-500/10",
    colorScheme: "indigo",
    accentColor: "from-indigo-500 to-purple-400",
    borderColor: "border-indigo-300/50",
    textColor: "text-indigo-800",
  },
};

// SVG patterns for background
export const svgPatterns = {
  abstract: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='%234f46e5' fill-opacity='0.1'/%3E%3Ccircle cx='80' cy='20' r='10' fill='%234f46e5' fill-opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%234f46e5' fill-opacity='0.1'/%3E%3Ccircle cx='20' cy='80' r='12' fill='%234f46e5' fill-opacity='0.1'/%3E%3Ccircle cx='80' cy='80' r='18' fill='%234f46e5' fill-opacity='0.1'/%3E%3C/svg%3E")`,
};

// Animation styles
export const navbarAnimations = `
  @keyframes float {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    33% {
      transform: translateY(-10px) translateX(5px);
    }
    66% {
      transform: translateY(5px) translateX(-5px);
    }
  }

  @keyframes border-spin {
    0% {
      transform: rotate(0deg);
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: rotate(360deg);
      opacity: 0.1;
    }
  }

  @keyframes ping-slow {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes ping-slower {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .animate-float {
    animation: float linear infinite;
  }

  .animate-border-spin {
    animation: border-spin 20s linear infinite;
  }

  .animate-ping-slow {
    animation: ping-slow 2s ease-in-out infinite;
  }

  .animate-ping-slower {
    animation: ping-slower 3s ease-in-out infinite;
  }

  .animate-rotate {
    animation: rotate 0.3s ease-in-out;
  }

  .animate-bounce {
    animation: bounce 0.6s ease-in-out;
  }

  /* Tablet-specific tweaks to prevent overflow while preserving look */
  @media (max-width: 900px) {
    nav {
      /* slightly tighter padding on medium widths to avoid overflow */
    }
  }

  @media (max-width: 800px) {
    /* reduce title padding a bit so it fits when buttons are visible */
    .relative > .relative.px-6 {
      padding-left: 0.9rem;
      padding-right: 0.9rem;
    }
  }
`;

// Navbar component styles - COMPLETE
export const navbarStyles = {
  // Main container styles
  container: "relative font-serif flex justify-center items-center py-4 px-4",

  // Nav element styles
  nav: (borderColor, isHovering) =>
    `relative w-full max-w-7xl rounded-xl xl:rounded-full backdrop-blur-md bg-white/55 border ${borderColor} shadow-xl overflow-hidden transition-all duration-500 ${
      isHovering ? "shadow-2xl " : "shadow-lg"
    }`,

  // Pattern container
  patternContainer: "absolute inset-0 rounded-2xl overflow-hidden",
  patternLayer: "absolute inset-0 pointer-events-none opacity-30",

  // Inner layout
  innerContainer: "relative p-3 md:p-5",
  flexContainer: "flex items-center justify-between gap-3",

  // Logo section
  logoSection: "relative flex items-center gap-3 flex-shrink-0",
  logoWrapper: "relative group",
  logoButton:
    "relative transform transition-all duration-500 flex items-center gap-2",
  logoImageContainer: "relative p-1.5 flex-shrink-0",
  logoImage:
    "h-10 w-10 md:h-11 md:w-11 cursor-pointer lg:h-12 lg:w-12 object-cover flex-shrink-0",
  mobileTitleContainer:
    "block md:hidden font-semibold text-gray-800 whitespace-nowrap",
  titleGradient:
    "bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 uppercase md:text-xl xl:text-2xl bg-clip-text text-sm text-transparent",

  // Title section
  titleContainer: "hidden md:flex flex-1 justify-center px-2 min-w-0",
  titleWrapper: "relative",
  titleBox:
    "relative lg:ml-50 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full border border-white/80 shadow-sm max-w-[60vw] md:max-w-[40ch]",
  titleText: (textColor) =>
    `text-xl md:text-xl xl:text-2xl font-bold ${textColor} whitespace-nowrap tracking-tight `,

  // Desktop buttons
  desktopButtons: "hidden md:flex items-center space-x-3 flex-shrink-0",
  buttonBase: (accentColor) =>
    `group relative px-4 py-2.5 cursor-pointer rounded-full bg-gradient-to-r ${accentColor} text-white font-semibold shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`,
  buttonHoverEffect:
    "absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000",
  buttonContent: "relative flex items-center gap-2",
  buttonIcon: "h-5 w-5",
  buttonText: "text-sm",
  logoutButton:
    "group relative px-4 cursor-pointer py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 text-white font-semibold shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105",

  // Mobile menu button
  mobileMenuContainer: "md:hidden flex items-center",
  mobileMenuButton: (accentColor) =>
    `relative p-2.5 rounded-xl bg-gradient-to-r ${accentColor} text-white shadow-md transition-all duration-300 hover:scale-105`,
  mobileMenuIcon: "h-5 w-5",

  // Mobile dropdown menu
  mobileMenuWrapper: "md:hidden mt-4 pt-4 border-t border-gray-200/50",
  mobileMenuContent: "flex flex-col space-y-2 px-2",
  mobileMenuItem: (accentColor) =>
    `group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${accentColor} text-white font-medium shadow-md transition-all duration-300 hover:scale-[1.02]`,

  // Icon animations
  iconAnimateBounce: "group-hover:animate-bounce",
  iconRotate180: "group-hover:rotate-180 transition-transform duration-500",
  iconTranslateX: "group-hover:translate-x-1 transition-transform duration-300",

  // Mobile logout button (has different gradient)
  mobileLogoutButton:
    "group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-400 text-white font-medium shadow-md transition-all duration-300 hover:scale-[1.02]",

  // Utility styles
  backgroundPatternStyle: {
    backgroundSize: "200px 200px",
    backgroundPosition: "center",
  },
};


// assets/dummyStyles.js (add these exports)

// Result page sample data
export const sampleResults = [
  {
    id: "basic",
    title: "HTML Basic",
    totalQuestions: 30,
    correct: 20,
    wrong: 0,
    startDate: "2024-03-15T10:30:00",
    timeTaken: 45,
  },
  {
    id: "intermediate",
    title: "HTML Intermediate",
    totalQuestions: 60,
    correct: 25,
    wrong: 5,
    startDate: "2024-03-16T14:00:00",
    timeTaken: 80,
  },
  {
    id: "advance",
    title: "HTML Advanced",
    totalQuestions: 100,
    correct: 100,
    wrong: 0,
    startDate: "2024-03-17T09:00:00",
    timeTaken: 105,
  },
  {
    id: "basic",
    title: "CSS Basic",
    totalQuestions: 30,
    correct: 8,
    wrong: 2,
    startDate: "2024-03-18T13:00:00",
    timeTaken: 40,
  },
  {
    id: "intermediate",
    title: "CSS Intermediate",
    totalQuestions: 60,
    correct: 55,
    wrong: 5,
    startDate: "2024-03-19T15:30:00",
    timeTaken: 80,
  },
  {
    id: "advance",
    title: "CSS Advanced",
    totalQuestions: 100,
    correct: 11,
    wrong: 4,
    startDate: "2024-03-20T11:00:00",
    timeTaken: 90,
  },
  {
    id: "basic",
    title: "JS Basic",
    totalQuestions: 30,
    correct: 8,
    wrong: 2,
    startDate: "2024-03-21T10:00:00",
    timeTaken: 45,
  },
  {
    id: "intermediate",
    title: "JS Intermediate",
    totalQuestions: 60,
    correct: 7,
    wrong: 5,
    startDate: "2024-03-22T14:30:00",
    timeTaken: 80,
  },
  {
    id: "advance",
    title: "JS Advanced",
    totalQuestions: 100,
    correct: 50,
    wrong: 4,
    startDate: "2024-03-23T09:30:00",
    timeTaken: 105,
  },
];

// Badge styles function
export const getBadgeClasses = (percent) => {
  if (percent >= 85) return "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200";
  if (percent >= 65) return "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 border border-indigo-200";
  if (percent >= 45) return "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
  return "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200";
};

// Badge text function
export const getBadgeText = (percent) => {
  if (percent >= 85) return "Excellent";
  if (percent >= 65) return "Good";
  if (percent >= 45) return "Average";
  return "Needs Work";
};

// Color classification function
export const getColorClass = (percent) => {
  if (percent >= 85) return "emerald";
  if (percent >= 65) return "indigo";
  if (percent >= 45) return "yellow";
  return "red";
};

// Color classes mapping
export const colorClasses = {
  emerald: {
    bg: "bg-gradient-to-r from-emerald-400 to-emerald-600",
    border: "border-emerald-300",
    hoverBorder: "hover:border-emerald-400",
    text: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    statBg: "bg-emerald-50 border-emerald-100",
  },
  indigo: {
    bg: "bg-gradient-to-r from-indigo-400 to-indigo-600",
    border: "border-indigo-300",
    hoverBorder: "hover:border-indigo-400",
    text: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    statBg: "bg-indigo-50 border-indigo-100",
  },
  yellow: {
    bg: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    border: "border-yellow-300",
    hoverBorder: "hover:border-yellow-400",
    text: "text-yellow-600",
    iconBg: "bg-yellow-50 border-yellow-200 text-yellow-700",
    statBg: "bg-yellow-50 border-yellow-100",
  },
  red: {
    bg: "bg-gradient-to-r from-red-400 to-red-600",
    border: "border-red-300",
    hoverBorder: "hover:border-red-400",
    text: "text-red-600",
    iconBg: "bg-red-50 border-red-200 text-red-700",
    statBg: "bg-red-50 border-red-100",
  },
};

// Result page styles
export const resultPageStyles = {
  // Main container styles
  container: "min-h-screen font-[pacifico] bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6",
  innerContainer: "max-w-6xl mx-auto",
  
  // Header styles
  header: "mb-8 md:mb-10 flex justify-center",
  headerBox: "bg-white rounded-full p-6 md:p-8 shadow-sm border border-gray-100 text-center min-w-[260px]",
  headerTitle: "text-2xl md:text-3xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent animate-fade-in-up",
  
  // Track section styles
  trackSection: "mb-8 md:mb-10",
  trackHeader: "flex items-center justify-between mb-4",
  trackTitle: "text-xl md:text-2xl font-bold shadow-md bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent bg-white px-4 py-2 rounded-full border border-gray-100",
  
  // Cards grid
  cardsGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5",
  
  // StripCard component styles
  stripCard: (colors) => `
    relative bg-white rounded-2xl overflow-hidden
    border-2 ${colors.border}
    shadow-md hover:shadow-xl transition-all duration-300
    ${colors.hoverBorder} cursor-pointer
    transform hover:-translate-y-1
  `,
  stripCardAccent: (colors) => `h-2 w-full ${colors.bg}`,
  stripCardContent: "p-5",
  
  // StripCard top row
  stripCardTopRow: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4",
  stripCardIconContainer: (colors) => `flex items-center justify-center w-12 h-12 rounded-xl ${colors.iconBg} border`,
  stripCardIconText: "font-bold text-lg",
  stripCardTitleContainer: "min-w-0",
  stripCardTitle: "text-base font-bold text-gray-800",
  stripCardSubtitle: "text-sm text-gray-500 mt-1",
  stripCardPercentContainer: "text-right sm:text-right",
  stripCardPercent: (colors) => `text-2xl md:text-lg font-bold ${colors.text}`,
  stripCardBadgeContainer: "mt-2 whitespace-nowrap",
  
  // StripCard stats row
  stripCardStatsRow: "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4",
  stripCardStat: (isCorrect, colors) => 
    `text-center p-3 rounded-lg ${isCorrect ? colors.statBg : "bg-gray-50"} border ${isCorrect ? "border-" + colors.statBg.split('-')[1] + "-100" : "border-gray-100"}`,
  stripCardStatNumber: "text-2xl font-bold text-gray-800",
  stripCardStatLabel: "text-xs text-gray-500 mt-1",
  
  // StripCard date and time section
  stripCardDateTimeSection: "pt-4 border-t border-gray-100",
  stripCardDateTimeGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  stripCardDateBox: "bg-gray-50 p-3 rounded-lg border border-gray-100",
  stripCardTimeBox: "bg-blue-50 p-3 rounded-lg border border-blue-100",
  stripCardDateTimeLabel: "text-xs font-medium mb-1",
  stripCardDateLabel: "text-gray-500",
  stripCardTimeLabel: "text-blue-500",
  stripCardDateTimeValue: "text-sm font-medium",
  stripCardDateValue: "text-gray-800",
  stripCardTimeValue: "text-blue-800",
  stripCardStartedAtBox: "mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100",
  stripCardStartedAtLabel: "text-xs font-medium text-gray-500 mb-1",
  stripCardStartedAtValue: "text-sm font-medium text-gray-800",
  
  // Badge component style
  Badge: ({ percent }) => {
    const classes = getBadgeClasses(percent);
    const text = getBadgeText(percent);
    return { classes, text };
  },
  
  // Helper functions
  formatDate: (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  },
  
  formatTimeTaken: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  },
};

// Animation styles for result page
export const resultPageAnimations = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
`;



// src/assets/dummyStyles.js

export const sidebarStyles = {
  // Layout and container styles
  container: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
  flexContainer: "flex xl:h-screen xl:overflow-y-hidden lg:h-screen lg:overflow-y-hidden",
  
  // Overlay styles
  overlay: "fixed inset-0 bg-black/20 backdrop-blur-sm z-30",
  
  // Sidebar styles
  sidebar: "fixed h-screen font-mono z-40 top-0 left-0 w-80 transform transition-transform duration-300 ease-in-out bg-white/90 backdrop-blur-sm shadow-2xl rounded-r-3xl overflow-y-auto border-r border-white/30 lg:relative lg:translate-x-0 lg:flex lg:flex-col",
  sidebarOpen: "translate-x-0",
  sidebarClosed: "-translate-x-full",
  
  // Sidebar header
  sidebarHeader: "sticky top-0 z-20 p-6 bg-gradient-to-br from-rose-50/95 to-amber-50/95 border-b border-blue-100/50 backdrop-blur-sm",
  headerContent: "flex items-center justify-between relative z-10",
  logoContainer: "flex items-center space-x-3",
  logoIcon: "p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg",
  logoTextContainer: "mt-1 text-slate-600 text-sm",
  title: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
  subtitle: "mt-1 text-slate-600 text-sm",
  closeButton: "p-2 rounded-lg bg-white/60 hover:bg-white/80 transition lg:hidden",
  
  // Sidebar content
  sidebarContent: "sidebar-content flex-1 overflow-y-auto p-4",
  techSectionHeader: "mb-4 flex items-center justify-between",
  techTitle: "text-lg font-semibold text-slate-700 flex items-center gap-2",
  techTitleAccent: "w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full",
  techCountBadge: "text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full",
  
  // Technology buttons
  techButton: "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm",
  techButtonSelected: "border-blue-400 cursor-pointer  shadow-lg transform scale-[1.02]",
  techButtonUnselected: "border-white/50  hover:border-blue-300 cursor-pointer hover:shadow-md hover:bg-white/50",
  techIconContainer: "flex items-center space-x-3",
  techIcon: "p-2 rounded-lg shadow-sm",
  techName: "font-medium text-slate-800",
  techChevron: "text-gray-400",
  
  // Level selection container
  levelContainer: "mt-3 ml-2 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm",
  levelButton: "w-full p-3 my-2 rounded-xl border transition-all backdrop-blur-sm",
  levelButtonSelected: "border-current shadow-md font-bold",
  levelButtonUnselected: "border-white/50 hover:bg-white/60",
  levelContent: "flex items-center justify-between w-full mb-1",
  levelInfo: "flex items-center space-x-2",
  levelIconContainer: "p-1.5 rounded-lg shadow-sm",
  levelName: "font-medium text-left text-slate-800",
  levelStats: "flex flex-col items-end",
  questionCountBadge: "text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-slate-700 px-2 py-1 rounded-full mb-1",
  timeBadge: "text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-2 py-0.5 rounded-full",
  progressContainer: "flex items-center justify-between w-full mt-1",
  answeredBadge: "text-xs bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-2 py-0.5 rounded-full",
  completedBadge: "text-xs bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-2 py-0.5 rounded-full",
  
  // Sidebar footer
  sidebarFooter: "sticky bottom-0 z-20 p-4 border-t border-white/30 bg-white/80 backdrop-blur-sm",
  footerTextContainer: "text-center text-xs text-slate-500 pt-2",
  footerText1: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold",
  footerText2: "mt-1 text-blue-600/80 font-medium",
  
  // Main content header
  mainContent: "flex-1 font-mono min-h-screen p-4 md:p-8 ml-0 md:ml-0 overflow-y-auto",
  mobileHeader: "flex items-center justify-between mb-4",
  hamburgerButton: "p-2 rounded-xl lg:hidden bg-white/80 backdrop-blur-sm shadow-lg",
  
  // Mobile level selection
  mobileLevelContainer: "lg:hidden mb-4",
  mobileLevelScroll: "flex gap-2 overflow-x-auto pb-2",
  mobileLevelButton: "flex-none px-4 py-3 rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm shadow-lg min-w-[140px]",
  mobileLevelContent: "flex flex-col items-center space-y-1",
  mobileLevelName: "font-medium text-sm text-slate-800",
  mobileLevelStats: "flex items-center space-x-2",
  
  // Empty state (no tech selected)
  emptyState: "h-full overflow-y-hidden pb-40 font-serif flex items-center justify-center py-16 px-4",
  emptyStateCard: "text-center w-full max-w-3xl mx-auto bg-gradient-to-br from-rose-50/95 to-amber-50/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-rose-200/40 border border-rose-100/50",
  emptyStateHeader: "mb-8",
  emptyStateIconContainer: "inline-flex items-center justify-center p-3 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl mb-4",
  emptyStateTitle: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-3",
  emptyStateSubtitle: "text-sm md:text-base text-slate-800 mb-6 max-w-md mx-auto leading-relaxed",
  featureCardsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8",
  
  // Feature card
  featureCard: "group relative h-full",
  featureCardGlow: "absolute -inset-0.5 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition duration-300",
  featureCardBody: "relative bg-white/95 p-5 rounded-xl border backdrop-blur-sm text-center h-full flex  flex-col",
  featureCardIconContainer: "inline-flex items-center justify-center p-2 rounded-lg mb-3 ring-1",
  featureCardTitle: "font-semibold text-slate-800 text-base mb-3",
  featureCardList: "space-y-2 text-left flex-grow",
  featureListItem: "flex items-center text-xs text-slate-600",
  listDot: "w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0",
  
  // Level stats in feature cards
  levelStatRow: "flex items-center justify-between text-xs mb-2",
  levelStatBadge: "font-medium px-2 py-1 rounded-full",
  levelStatTime: "text-slate-600",
  featureCheckItem: "flex items-center text-xs text-slate-600",
  checkIcon: "w-3 h-3 mr-2 flex-shrink-0",
  
  // Call to action
  ctaContainer: "relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-rose-50/80 p-4 border border-rose-200/50",
  ctaAccent: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500",
  ctaText: "flex items-center justify-center",
  ctaTextInner: "flex items-center text-rose-700 text-sm font-medium",
  ctaSparkle: "w-4 h-4 mr-2 text-amber-500",
  
  // Tech selected, no level
  techSelectedState: "h-full font-serif flex items-center justify-center py-20",
  techSelectedCard: "text-center bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30 max-w-md",
  techSelectedIcon: "p-5 rounded-2xl shadow-xl inline-flex mb-6",
  techSelectedTitle: "text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2",
  techSelectedSubtitle: "text-slate-600 mb-6",
  progressList: "mb-6 space-y-2",
  progressItem: "bg-gradient-to-r from-emerald-50/80 to-teal-50/80 p-3 rounded-xl border border-emerald-200/50 backdrop-blur-sm",
  progressText: "text-emerald-700 font-medium",
  readyMessage: "bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-4 rounded-2xl border border-blue-200/50 backdrop-blur-sm",
  readyText: "text-blue-700 font-medium",
  
  // Results screen
  resultsScreen: "h-full mt-20 md:pb-20 lg:mt-40 mb-30 font-serif flex items-center justify-center py-10",
  resultsCard: "bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full",
  resultsHeader: "text-center",
  resultsIconContainer: "p-5 rounded-2xl shadow-lg inline-flex mb-6",
  resultsTitle: "text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2",
  resultsSubtitle: "text-slate-600 mb-2",
  performanceBadge: "inline-block px-4 py-2 rounded-full text-sm font-medium mb-6",
  
  // Time taken display
  timeTakenContainer: "mb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5 rounded-2xl border border-blue-200/50 backdrop-blur-sm",
  timeTakenHeader: "flex items-center justify-center mb-3",
  timeTakenIcon: "text-blue-600 mb-7 md:mb-0 lg:mb-0 xl:mb-0 xl:ml-0 md:ml-0 xl:ml-0 ml-4 md:mr-2",
  timeTakenText: "text-blue-700 font-semibold text-lg",
  timeTakenSubtext: "text-sm text-blue-600",
  
  // Score cards
  scoreCardsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6",
  scoreCard: "p-5 rounded-2xl border backdrop-blur-sm text-center",
  scoreCardIconContainer: "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3",
  scoreCardNumber: "text-2xl font-bold",
  scoreCardLabel: "font-medium",
  
  // Overall score
  overallScoreContainer: "bg-gradient-to-r from-indigo-50/80 to-blue-50/80 p-5 rounded-2xl border border-indigo-200/50 backdrop-blur-sm mb-6",
  overallScoreHeader: "flex items-center justify-between mb-4",
  overallScoreLabel: "text-indigo-700 font-semibold",
  overallScoreValue: "text-indigo-700 font-bold",
  progressBarContainer: "w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3",
  progressBar: "h-3 rounded-full",
  scoreDescription: "mt-2 text-sm text-slate-600",
  
  // Results buttons
  resultsButtonsContainer: "flex flex-col md:flex-col lg:flex-row sm:flex-row gap-3 justify-center",
  reviewButton: "px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2",
  restartButton: "px-6 py-3 cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all border border-gray-300/50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2",
  
  // Start quiz screen
  startQuizScreen: "h-full font-serif flex items-center overflow-y-hidden justify-center py-10",
  startQuizCard: "bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-lg border border-white/30 max-w-2xl w-full",
  startQuizHeader: "text-center",
  startQuizIconContainer: "p-5 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl inline-flex mb-6",
  startQuizTitle: "text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2",
  startQuizSubtitle: "text-slate-600 mb-4",
  
  // Quiz info card
  quizInfoCard: "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5 rounded-2xl border border-blue-200/50 backdrop-blur-sm mb-6",
  quizInfoHeader: "flex flex-col md:flex-row lg:flex-row items-center justify-between mb-4",
  techDisplay: "flex items-center mb-3 md:mb-0",
  techDisplayIcon: "p-3 rounded-xl mr-3",
  techDisplayText: "text-left",
  techDisplayName: "font-semibold text-slate-800",
  techDisplayLevel: "text-sm text-slate-600",
  quizStats: "flex items-center space-x-4",
  statItem: "text-center",
  statNumber: "text-lg font-bold text-slate-800 flex items-center",
  statLabel: "text-sm text-slate-600",
  instructionsContainer: "mt-4 pt-4 border-t border-blue-200/50",
  instructionsTitle: "font-semibold text-blue-700 mb-2",
  instructionsList: "text-sm text-slate-700 text-left space-y-1",
  instructionItem: "flex items-center",
  instructionCheck: "text-emerald-500 mr-2",
  
  // Progress warning
  progressWarning: "mb-6 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl border border-amber-200/50 backdrop-blur-sm",
  warningText: "text-amber-700 font-medium",
  
  // Start quiz buttons
  startButtonsContainer: "flex flex-col sm:flex-row gap-4 justify-center",
  startButton: "px-8 py-3 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2",
  changeLevelButton: "px-8 py-3 cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all border border-gray-300/50 shadow-lg hover:shadow-xl",
  
  // Quiz in progress container
  quizContainer: "max-w-3xl mx-auto pb-8",
  quizHeaderCard: "mb-6 bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xl border border-white/30",
  quizHeader: "flex flex-col sm:flex-col items-center justify-between mb-6",
  quizTitle: "text-xl md:text-lg xl:text-2xl lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-0",
  reviewModeBadge: "text-xs xl:text-lg lg:text-md bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 px-3 py-1 rounded-full",
  statsGrid: "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2 lg:grid-cols-3 xl:grid-cols-3 mt-4 items-center space-x-4",
  
  // Timer display
  timerDisplay: "flex items-center space-x-2 px-4 py-2 rounded-full font-medium shadow-sm",
  timerText: "text-sm font-mono",
  
  // Progress badges
  questionBadge: "text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-2 rounded-full font-medium shadow-sm",
  answeredBadgeQuiz: "text-sm bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-3 py-2 rounded-full font-medium shadow-sm",
  
  // Progress bar
  mainProgressBarContainer: "w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2.5 mb-2",
  mainProgressBar: "bg-gradient-to-r from-blue-400 to-purple-400 h-2.5 rounded-full transition-all duration-500",
  
  // Question indicators
  questionIndicators: "flex flex-wrap gap-2 mt-4",
  questionIndicator: "w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all hover:scale-110 hover:shadow-md shadow-sm",
  currentQuestion: "ring-2 ring-blue-400 ring-offset-2",
  
  // Time warning
  timeWarning: "mt-3 text-sm text-rose-600 flex items-center bg-gradient-to-r from-rose-50/80 to-pink-50/80 p-3 rounded-xl border border-rose-200/50",
  warningIcon: "mr-2",
  
  // Question card
  questionCard: "bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/30 mb-6",
  questionHeader: "mb-6 flex justify-between items-center",
  questionIconContainer: "flex items-center",
  questionIcon: "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 p-3 rounded-2xl mr-3 shadow-sm",
  questionTextContainer: "text-lg md:text-xl font-semibold text-slate-800",
  
  // Status badge
  statusBadge: "px-2 py-2 mb-60 mr-60 md:mb-0 md:mr-0 lg:mb-0 lg:mr-0 xl:mb-0 xl:mr-0 items-center justify-between rounded-full text-sm font-medium",
  
  // Options container
  optionsContainer: "space-y-4 mt-6",
  optionButton: "w-full text-left p-5 mb-5 md:p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm",
  optionButtonHover: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
  optionButtonDisabled: "cursor-default opacity-90",
  optionContent: "flex items-center",
  optionRadio: "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0",
  optionText: "text-base md:text-lg",
  correctAnswerBadge: "ml-auto text-xs bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium",
  
  // Explanation section
  explanationContainer: "mt-8 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm",
  explanationHeader: "flex items-center mb-3",
  explanationIcon: "text-blue-600 mr-3",
  explanationTitle: "font-semibold text-blue-700 text-lg",
  explanationContent: "bg-white/50 p-4 rounded-xl backdrop-blur-sm",
  explanationText: "text-blue-800",
  
  // Navigation buttons
  navButtonsContainer: "flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-center gap-4",
  prevButton: "flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all shadow-sm",
  prevButtonEnabled: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:shadow-md",
  prevButtonDisabled: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed",
  navRightContainer: "flex items-center space-x-3",
  nextButton: "px-6 py-3 cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg flex items-center space-x-2",
  submitButton: "px-8 cursor-pointer py-3 font-medium rounded-xl transition-all shadow-lg hover:shadow-xl",
  submitButtonResults: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600",
  submitButtonQuiz: "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600",
  backToResultsButton: "px-8 cursor-pointer py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl",
  
  // Loading state
  loadingState: "h-full flex items-center justify-center py-20",
  loadingCard: "text-center bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30",
  loadingSpinner: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4",
  loadingText: "text-lg md:text-xl font-semibold text-slate-800 mb-2",
  loadingSubtext: "text-sm md:text-base text-slate-600",
};

// CSS styles for the style tag
export const cssStyles = `
  .sidebar-content { -webkit-overflow-scrolling: touch; }
  aside .sidebar-content::-webkit-scrollbar { width: 10px; }
  aside .sidebar-content::-webkit-scrollbar-track { background: transparent; }
  aside .sidebar-content::-webkit-scrollbar-thumb {
    background-color: rgba(99,102,241,0.12);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  aside .sidebar-content::-webkit-scrollbar-thumb:hover { background-color: rgba(99,102,241,0.18); }
  aside .sidebar-content { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.12) transparent; }
  
  /* Prevent text overflow in level buttons */
  .level-button-content {
    min-width: 0;
  }
  .level-button-content span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Timer animation */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .time-warning {
    animation: pulse 1s infinite;
  }
  
  /* Custom scrollbar for main content */
  main {
    scrollbar-width: thin;
    scrollbar-color: rgba(99,102,241,0.12) transparent;
  }
  
  main::-webkit-scrollbar {
    width: 8px;
  }
  
  main::-webkit-scrollbar-track {
    background: transparent;
  }
  
  main::-webkit-scrollbar-thumb {
    background-color: rgba(99,102,241,0.1);
    border-radius: 999px;
  }
  
  main::-webkit-scrollbar-thumb:hover {
    background-color: rgba(99,102,241,0.2);
  }
`;

// Color schemes for technologies and levels
export const colorSchemes = {
  technologies: {
    html: {
      color: "bg-rose-50 text-rose-600 border-rose-200",
      iconColor: "text-rose-500",
    },
    css: {
      color: "bg-sky-50 text-sky-600 border-sky-200",
      iconColor: "text-sky-500",
    },
    js: {
      color: "bg-amber-50 text-amber-600 border-amber-200",
      iconColor: "text-amber-500",
    },
    react: {
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
      iconColor: "text-cyan-500",
    },
    node: {
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    mongodb: {
      color: "bg-teal-50 text-teal-600 border-teal-200",
      iconColor: "text-teal-500",
    },
    java: {
      color: "bg-orange-50 text-orange-600 border-orange-200",
      iconColor: "text-orange-500",
    },
    python: {
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      iconColor: "text-indigo-500",
    },
    cpp: {
      color: "bg-violet-50 text-violet-600 border-violet-200",
      iconColor: "text-violet-500",
    },
    bootstrap: {
      color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
      iconColor: "text-fuchsia-500",
    },
  },
  levels: {
    basic: {
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    intermediate: {
      color: "bg-amber-50 text-amber-600 border-amber-200",
      iconColor: "text-amber-500",
    },
    advanced: {
      color: "bg-rose-50 text-rose-600 border-rose-200",
      iconColor: "text-rose-500",
    },
  },
};

// Helper function for time color based on remaining time
export const getTimeColor = (timeLeft, totalTime, isSubmitted, reviewMode) => {
  if (isSubmitted || reviewMode) return "text-gray-600 bg-gray-100";
  
  const percentage = (timeLeft / totalTime) * 100;
  
  if (percentage > 50) return "text-emerald-600 bg-emerald-100";
  if (percentage > 25) return "text-amber-600 bg-amber-100";
  return "text-rose-600 bg-rose-100";
};

// Helper function for score-based performance status

 

// Helper function for question status colors
export const getQuestionStatusColor = (status, reviewMode) => {
  if (!reviewMode) {
    return {
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
      textColor: "text-gray-500",
    };
  }
  
  switch (status) {
    case "correct":
      return {
        bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
        textColor: "text-emerald-700",
      };
    case "incorrect":
      return {
        bgColor: "bg-gradient-to-br from-rose-100 to-pink-100",
        textColor: "text-rose-700",
      };
    case "marked-unattempted":
      return {
        bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
        textColor: "text-amber-700",
      };
    case "unattempted":
      return {
        bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
        textColor: "text-gray-500",
      };
    default:
      return {
        bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
        textColor: "text-gray-500",
      };
  }
};

// Helper function for option button styling
export const getOptionButtonStyle = (isSelected, isCorrect, showFeedback, index, correctIndex) => {
  if (!showFeedback) {
    if (isSelected) {
      return {
        buttonClass: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700 shadow-md",
        textClass: "text-blue-700",
        radioClass: "bg-gradient-to-br from-blue-400 to-indigo-400 border-blue-500",
      };
    }
    return {
      buttonClass: "border-white/50 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md",
      textClass: "text-slate-800",
      radioClass: "border-gray-300",
    };
  }
  
  if (isCorrect) {
    return {
      buttonClass: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-700 shadow-md",
      textClass: "text-emerald-700",
      radioClass: "bg-gradient-to-br from-emerald-400 to-teal-400 border-emerald-500",
    };
  }
  
  if (isSelected) {
    return {
      buttonClass: "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-300 text-rose-700 shadow-md",
      textClass: "text-rose-700",
      radioClass: "bg-gradient-to-br from-rose-400 to-pink-400 border-rose-500",
    };
  }
  
  return {
    buttonClass: "border-white/50 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md",
    textClass: "text-slate-800",
    radioClass: "border-gray-300",
  };
};