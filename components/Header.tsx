import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSystemSettingsStore } from "@/stores/systemSettingsStore";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/imageUtils";
import api from "@/lib/axios";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, loading, fetchSettings } = useSystemSettingsStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openCart, items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch settings on mount only once
  useEffect(() => {
    if (!settings && !loading) {
      console.log("[Header] Fetching system settings...");
      fetchSettings();
    }
  }, [settings, loading, fetchSettings]);

  // ... inside Header component

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/orders/unread-count");
      console.log("Unread count fetched:", res.data.data.count);
      setUnreadCount(res.data.data.count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }

    const handleOrderCreated = () => {
      console.log("Order created event received, refreshing count...");
      setTimeout(fetchUnreadCount, 500);
    };

    window.addEventListener("order-created", handleOrderCreated);
    return () => window.removeEventListener("order-created", handleOrderCreated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!settings && !loading) {
      fetchSettings();
    }

    if (isAuthenticated) {
      fetchUnreadCount();
    }

    const handleOrderCreated = () => {
      console.log("Order created event received, refreshing count...");
      // Small delay to ensure DB update
      setTimeout(fetchUnreadCount, 500);
    };

    window.addEventListener("order-created", handleOrderCreated);

    // Also refresh on route change to keep it sync
    // Also refresh on route change to keep it sync
    if (isAuthenticated) {
      fetchUnreadCount();
    }

    return () => window.removeEventListener("order-created", handleOrderCreated);
  }, [isAuthenticated, location.pathname]);

  // Use settings value directly with fallback
  const LiveURL = settings?.currentStreamLink || "https://kick.com";

  // Log when settings update
  useEffect(() => {
    if (settings) {
      console.log("[Header] Settings loaded:", {
        siteName: settings.siteName,
        streamLink: settings.currentStreamLink,
      });
    }
  }, [settings]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "صناع المحتوى", href: "/streamers" },
    { name: "القوانين", href: "/rules" },
    { name: "المتجر", href: "/store" },
    { name: "البثوث", href: LiveURL },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-primary/20 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("/");
                }
              }
            }}
          >
            <div className="relative group">
              <div className="relative flex items-center justify-center w-20 h-20  ">
                <img
                  src="/images/logo.png"
                  alt="Respect Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              target={link.href.startsWith("http") ? "_blank" : undefined}
              key={link.name}
              to={link.href}
              className="font-bold text-white/80 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {items.length}
              </span>
            )}
          </Button>
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={getImageUrl(user.avatar)} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button className="btn-neon" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-lg font-medium text-white hover:text-primary py-2 border-b border-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  navigate(`/profile/${user?.id}`);
                  setMobileMenuOpen(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="destructive"
                className="justify-start"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Button className="w-full" variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button className="w-full btn-neon" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
