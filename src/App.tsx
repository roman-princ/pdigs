import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DealershipProvider } from "@/contexts/DealershipContext";
import RouteTransition from "@/components/RouteTransition";
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

function getTopLevelRouteKey(pathname: string): string {
  const dealershipScope = pathname.match(/^\/d\/[^/]+/);
  return dealershipScope ? dealershipScope[0] : pathname;
}

const AnimatedDealershipRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <RouteTransition>
              <Index />
            </RouteTransition>
          }
        />
        <Route
          path="/car/:id"
          element={
            <RouteTransition>
              <CarDetail />
            </RouteTransition>
          }
        />
        <Route
          path="/compare"
          element={
            <RouteTransition>
              <Compare />
            </RouteTransition>
          }
        />
        <Route
          path="/calculator"
          element={
            <RouteTransition>
              <Calculator />
            </RouteTransition>
          }
        />
        <Route
          path="/estimate"
          element={
            <RouteTransition>
              <Estimate />
            </RouteTransition>
          }
        />
        <Route
          path="/about"
          element={
            <RouteTransition>
              <About />
            </RouteTransition>
          }
        />
        <Route
          path="/car/:id/contract"
          element={
            <RouteTransition>
              <ProtectedRoute>
                <SalesContract />
              </ProtectedRoute>
            </RouteTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteTransition>
              <DealershipOwnerRoute>
                <Admin />
              </DealershipOwnerRoute>
            </RouteTransition>
          }
        />
        <Route
          path="*"
          element={
            <RouteTransition>
              <NotFound />
            </RouteTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AnimatedAppRoutes = () => {
  const location = useLocation();
  const routeKey = getTopLevelRouteKey(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routeKey}>
        {/* SaaS landing page */}
        <Route
          path="/"
          element={
            <RouteTransition>
              <Landing />
            </RouteTransition>
          }
        />
        <Route
          path="/500"
          element={
            <RouteTransition>
              <ServerError />
            </RouteTransition>
          }
        />
        <Route
          path="/discover"
          element={
            <RouteTransition>
              <DiscoverDealerships />
            </RouteTransition>
          }
        />
        <Route
          path="/login"
          element={
            <RouteTransition>
              <Login />
            </RouteTransition>
          }
        />
        <Route
          path="/account"
          element={
            <RouteTransition>
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            </RouteTransition>
          }
        />

        {/* Dealership-scoped routes */}
        <Route
          path="/d/:slug/*"
          element={
            <DealershipProvider>
              <AnimatedDealershipRoutes />
            </DealershipProvider>
          }
        />

        <Route
          path="*"
          element={
            <RouteTransition>
              <NotFound />
            </RouteTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={routerBase}>
            <AnimatedAppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
