import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { queryClient, restorePersistedQueryCache, setupQueryCachePersistence } from "@/lib/queryClient";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Perfis from "./pages/Perfis";
import Posts from "./pages/Posts";
import Comparativo from "./pages/Comparativo";
import Inteligencia from "./pages/Inteligencia";
import Relatorios from "./pages/Relatorios";
import Alertas from "./pages/Alertas";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

restorePersistedQueryCache();

const App = () => {
  useEffect(() => {
    const teardown = setupQueryCachePersistence();
    return teardown;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/perfis"
                element={
                  <AuthGuard>
                    <Perfis />
                  </AuthGuard>
                }
              />
              <Route
                path="/posts"
                element={
                  <AuthGuard>
                    <Posts />
                  </AuthGuard>
                }
              />
              <Route
                path="/comparativo"
                element={
                  <AuthGuard>
                    <Comparativo />
                  </AuthGuard>
                }
              />
              <Route
                path="/inteligencia"
                element={
                  <AuthGuard>
                    <Inteligencia />
                  </AuthGuard>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <AuthGuard>
                    <Relatorios />
                  </AuthGuard>
                }
              />
              <Route
                path="/alertas"
                element={
                  <AuthGuard>
                    <Alertas />
                  </AuthGuard>
                }
              />
              
              {/* Admin only route */}
              <Route
                path="/admin"
                element={
                  <AuthGuard requireAdmin>
                    <Admin />
                  </AuthGuard>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
