import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { useAuth } from '@/contexts/AuthContext';
import TerminatedScreen from '@/components/TerminatedScreen';
import {
  LayoutDashboard, Users, Building2, Calendar, Clock,
  DollarSign, Bell, Briefcase, BarChart3, MessageSquare,
  User, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  Home, Search, Moon, Sun, Palette, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', description: 'Overview & Analytics' },
  { icon: Users, label: 'Employees', href: '/admin/employees', description: 'Manage your team' },
  { icon: Building2, label: 'Departments', href: '/admin/departments', description: 'Organizational structure' },
  { icon: Calendar, label: 'Leave Requests', href: '/admin/leaves', description: 'Approve & track leaves' },
  { icon: Clock, label: 'Attendance', href: '/admin/attendance', description: 'Time & presence' },
  // { icon: DollarSign, label: 'Payroll', href: '/admin/payroll', description: 'Compensation management' },
  { icon: Bell, label: 'Notices', href: '/admin/notices', description: 'Announcements' },
  { icon: Briefcase, label: 'Recruitment', href: '/admin/recruitment', description: 'Hire new talent' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', description: 'Insights & reports' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/admin/ai-chat', description: 'Smart HR help', badge: 'AI' },
];

const employeeNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/employee', description: 'Your overview' },
  { icon: User, label: 'Profile', href: '/employee/profile', description: 'Personal information' },
  { icon: Briefcase, label: 'My Tasks', href: '/employee/tasks', description: 'Assigned tasks' },
  { icon: BarChart3, label: 'Performance', href: '/employee/performance', description: 'Your reviews' },
  { icon: Calendar, label: 'Leave', href: '/employee/leave', description: 'Request time off' },
  { icon: Clock, label: 'Attendance', href: '/employee/attendance', description: 'Your time records' },
  // { icon: DollarSign, label: 'Salary', href: '/employee/salary', description: 'View payslips' },
  { icon: Bell, label: 'Notices', href: '/employee/notices', description: 'Company updates' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const sidebarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const navItems = user?.role === 'Admin' ? adminNavItems : employeeNavItems;
  const isActive = (href: string) => location.pathname === href;
  
  // Effective sidebar state (open when hovered in collapsed mode)
  const effectiveSidebarOpen = sidebarOpen || sidebarHovered;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user is terminated (is_active === false)
  if (user && user.is_active === false) {
    return (
      <TerminatedScreen 
        companyName={user.company_name} 
        onLogout={handleLogout} 
      />
    );
  }

  // Logo animation on mount
  useEffect(() => {
    if (logoRef.current) {
      animate(logoRef.current, {
        scale: [0.8, 1],
        rotate: ['-10deg', '0deg'],
        opacity: [0, 1],
        duration: 800,
        easing: 'spring(1, 80, 10, 0)'
      });
    }
  }, []);

  // Animate nav items on route change
  useEffect(() => {
    const activeItem = document.querySelector('.nav-item-active');
    if (activeItem) {
      animate(activeItem, {
        scale: [0.98, 1],
        duration: 300,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter nav items based on search
  const filteredNavItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavItem = ({ item, index, isMobile = false }: { item: typeof navItems[0], index: number, isMobile?: boolean }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const showLabel = isMobile || effectiveSidebarOpen;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={isMobile ? { opacity: 0, x: -20 } : false}
              animate={isMobile ? { opacity: 1, x: 0 } : undefined}
              transition={isMobile ? { delay: index * 0.05 } : undefined}
            >
              <Link
                to={item.href}
                className={`nav-item group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                  active
                    ? 'nav-item-active bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
                onMouseEnter={(e) => {
                  if (!active) {
                    animate(e.currentTarget, {
                      translateX: [0, 4, 0],
                      duration: 400,
                      easing: 'easeOutElastic(1, .8)'
                    });
                  }
                }}
              >
                <div className={`relative ${active ? '' : 'group-hover:scale-110'} transition-transform duration-200`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -inset-1 bg-white/20 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                
                <AnimatePresence>
                  {showLabel && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 overflow-hidden"
                    >
                      <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md uppercase">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active dot for collapsed state */}
                {active && !showLabel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          </TooltipTrigger>
          {!showLabel && (
            <TooltipContent side="right" className="flex flex-col gap-1">
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Subtle grid pattern overlay */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 pointer-events-none z-0" />

        {/* Desktop Sidebar */}
        <aside
          ref={sidebarRef}
          onMouseEnter={() => !sidebarOpen && setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          className={`fixed left-0 top-0 h-full bg-card/95 backdrop-blur-xl border-r border-border/50 z-40 transition-all duration-300 ease-out hidden lg:flex flex-col shadow-xl ${
            effectiveSidebarOpen ? 'w-64' : 'w-[72px]'
          }`}
        >
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div
                ref={logoRef}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow"
              >
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <AnimatePresence>
                {effectiveSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Lumina
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
            <AnimatePresence>
              {effectiveSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="shrink-0 hover:bg-secondary"
                  >
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Search */}
          <AnimatePresence>
            {effectiveSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 py-3 border-b border-border/50"
              >
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search... ⌘K"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-secondary/50 border-0 focus:bg-secondary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {(searchQuery ? filteredNavItems : navItems).map((item, index) => (
              <NavItem key={item.href} item={item} index={index} />
            ))}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-border/50">
            <AnimatePresence mode="wait">
              {effectiveSidebarOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-medium">
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.role} • {user?.company_name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20 cursor-pointer">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-medium">
                            {user?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-medium">{user?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-b border-border/50 z-40 flex items-center justify-between px-4 shadow-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <span className="text-lg font-bold text-foreground">Lumina</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 h-full w-80 bg-card z-50 shadow-2xl flex flex-col"
              >
                {/* Mobile Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                  <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">L</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">Lumina</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                {/* Mobile Search */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 bg-secondary/50 border-0"
                    />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {(searchQuery ? filteredNavItems : navItems).map((item, index) => (
                    <NavItem key={item.href} item={item} index={index} isMobile />
                  ))}
                </nav>

                {/* Mobile User Section */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-secondary/50 rounded-xl">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-lg">
                        {user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{user?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setIsDarkMode(!isDarkMode)} className="gap-2">
                      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {isDarkMode ? 'Light' : 'Dark'}
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Top Bar */}
        <header
          className={`fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 hidden lg:flex items-center justify-between px-6 transition-all duration-300 shadow-sm ${
            effectiveSidebarOpen ? 'left-64' : 'left-[72px]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {navItems.find(item => isActive(item.href))?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {navItems.find(item => isActive(item.href))?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hover:bg-secondary"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-secondary"
              onClick={() => navigate(user?.role === 'Admin' ? '/admin/notices' : '/employee/notices')}
              data-testid="notification-bell"
            >
              <Bell className="w-5 h-5" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card"
              />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-secondary">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-sm">
                      {user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block text-left">
                    <span className="font-medium text-sm block">{user?.full_name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user?.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2" sideOffset={8}>
                <div className="px-2 py-3 mb-2 bg-secondary/50 rounded-lg">
                  <p className="font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-primary mt-1">{user?.company_name}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link to={user?.role === 'Admin' ? '/admin/profile' : '/employee/profile'}>
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-3" />
                    Back to Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer rounded-lg focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`pt-20 lg:pt-20 min-h-screen transition-all duration-300 relative z-10 ${
            effectiveSidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="p-4 lg:p-6 xl:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
