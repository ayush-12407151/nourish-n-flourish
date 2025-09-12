import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Pantry from "./pages/Pantry";
import Reimaginer from "./pages/Reimaginer";
import MealPlanner from "./pages/MealPlanner";
import Profile from "./pages/Profile";
import DonateSell from "./pages/DonateSell";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('AppContent render:', { user: !!user, loading });

  if (loading) {
    console.log('AppContent: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }


  if (!user) {
    console.log('AppContent: No user, showing AuthForm');
    return <AuthForm />;
  }

  console.log('AppContent: User authenticated, showing main app');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/pantry" element={<MainLayout><Pantry /></MainLayout>} />
        <Route path="/reimaginer" element={<MainLayout><Reimaginer /></MainLayout>} />
        <Route path="/planner" element={<MainLayout><MealPlanner /></MainLayout>} />
        <Route path="/donate-sell" element={<MainLayout><DonateSell /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
