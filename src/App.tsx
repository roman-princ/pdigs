import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DealershipProvider } from "@/contexts/DealershipContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing.tsx";
import Index from "./pages/Index.tsx";
import CarDetail from "./pages/CarDetail.tsx";
import Compare from "./pages/Compare.tsx";
import Calculator from "./pages/Calculator.tsx";
import Estimate from "./pages/Estimate.tsx";
import Admin from "./pages/Admin.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* SaaS landing page */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Dealership-scoped routes */}
              <Route
                path="/d/:slug/*"
                element={
                  <DealershipProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/car/:id" element={<CarDetail />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/calculator" element={<Calculator />} />
                      <Route path="/estimate" element={<Estimate />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </DealershipProvider>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
