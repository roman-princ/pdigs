import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DealershipProvider } from "@/contexts/DealershipContext";
import {
  isSupabaseOutageError,
  redirectToServerErrorPage,
} from "@/lib/error-routing";
import ProtectedRoute from "@/components/ProtectedRoute";
import DealershipOwnerRoute from "@/components/DealershipOwnerRoute";
import Landing from "./pages/Landing.tsx";
import DiscoverDealerships from "./pages/DiscoverDealerships.tsx";
import Index from "./pages/Index.tsx";
import CarDetail from "./pages/CarDetail.tsx";
import Compare from "./pages/Compare.tsx";
import Calculator from "./pages/Calculator.tsx";
import Estimate from "./pages/Estimate.tsx";
import About from "./pages/About.tsx";
import SalesContract from "./pages/SalesContract.tsx";
import Admin from "./pages/Admin.tsx";
import Login from "./pages/Login.tsx";
import Account from "@/pages/Account";
import NotFound from "./pages/NotFound.tsx";
import ServerError from "./pages/ServerError.tsx";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isSupabaseOutageError(error)) {
        redirectToServerErrorPage();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isSupabaseOutageError(error)) {
        redirectToServerErrorPage();
      }
    },
  }),
});
const routerBase = import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={routerBase}>
            <Routes>
              {/* SaaS landing page */}
              <Route path="/" element={<Landing />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="/discover" element={<DiscoverDealerships />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

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
                      <Route path="/about" element={<About />} />
                      <Route
                        path="/car/:id/contract"
                        element={
                          <ProtectedRoute>
                            <SalesContract />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <DealershipOwnerRoute>
                            <Admin />
                          </DealershipOwnerRoute>
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
