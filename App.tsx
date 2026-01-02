import { Toaster } from "@/components/ui/sonner";
import { SEO } from "@/components/SEO/SEO";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/Home";
import StreamersPage from "./pages/StreamersPage";
import RulesPage from "./pages/RulesPage";
import LoginPage from "./pages/Dashboard/LoginPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import OverviewPage from "./pages/Dashboard/OverviewPage";
import RulesManagementPage from "./pages/Dashboard/RulesManagementPage";
import UsersManagementPage from "./pages/Dashboard/UsersManagementPage";
import OrdersPage from "./pages/Dashboard/OrdersPage";
import OrderDetailsPage from "./pages/Dashboard/OrderDetailsPage";
import UserOrdersPage from "@/pages/Dashboard/UserOrdersPage";
import SystemSettingsPage from "./pages/Dashboard/SystemSettingsPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import StorePage from "./pages/Store/StorePage";
import CreateItemPage from "./pages/Store/CreateItemPage";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SEO
            structuredData={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Respect CFW",
              url: "https://respect-cfw.com",
            }}
          />
          <Toaster />
          <Router>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/streamers" element={<StreamersPage />} />
                <Route path="/rules" element={<RulesPage />} />

                {/* Store Routes */}
                <Route path="/store" element={<StorePage />} />
                <Route path="/store/create" element={<CreateItemPage />} />

                {/* Auth Routes */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/my-orders" element={
                  <ProtectedRoute>
                    <UserOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/my-orders/:id" element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                } />

                <Route path={"/404"} element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/dashboard/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="rules" element={<RulesManagementPage />} />
                <Route path="users" element={<UsersManagementPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="settings" element={<SystemSettingsPage />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
