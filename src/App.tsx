import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { LoadingSpinner } from "./components/LazyLoad";

// Pagine Pubbliche Statiche/Dinamiche
import Index from "./pages/Index";
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Progetti = lazy(() => import("./pages/Progetti"));
const DonMario = lazy(() => import("./pages/DonMario"));
const Bambui = lazy(() => import("./pages/Bambui"));
const Articoli = lazy(() => import("./pages/Articoli"));
const Foto = lazy(() => import("./pages/Foto"));
const Eventi = lazy(() => import("./pages/Eventi"));
const Collaborazioni = lazy(() => import("./pages/Collaborazioni"));
const Contatti = lazy(() => import("./pages/Contatti"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Pannello di Amministrazione e Autenticazione
import ProtectedRoute from "./components/ProtectedRoute";
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Rotte Pubbliche */}
              <Route path="/" element={<Index />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/progetti" element={<Progetti />} />
              <Route path="/don-mario" element={<DonMario />} />
              <Route path="/bambui" element={<Bambui />} />
              <Route path="/articoli" element={<Articoli />} />
              <Route path="/foto" element={<Foto />} />
              <Route path="/eventi" element={<Eventi />} />
              <Route path="/collaborazioni" element={<Collaborazioni />} />
              <Route path="/contatti" element={<Contatti />} />

              {/* Rotte Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Rotta di fallback / 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

