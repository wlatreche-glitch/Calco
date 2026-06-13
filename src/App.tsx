import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import RouteTracker from "./components/RouteTracker";
import RouteFallback from "./components/RouteFallback";

const Equations = lazy(() => import("./pages/Equations"));
const Functions = lazy(() => import("./pages/Functions"));
const Graph = lazy(() => import("./pages/Graph"));
const Matrices = lazy(() => import("./pages/Matrices"));
const Sequences = lazy(() => import("./pages/Sequences"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Exercises = lazy(() => import("./pages/Exercises"));
const Physics = lazy(() => import("./pages/Physics"));
const BACMath = lazy(() => import("./pages/BACMath"));
const BEM = lazy(() => import("./pages/BEM"));
const BEMMath = lazy(() => import("./pages/BEMMath"));
const BEMPhysics = lazy(() => import("./pages/BEMPhysics"));
const BACChemistry = lazy(() => import("./pages/BACChemistry"));
const CalcoCoach = lazy(() => import("./pages/CalcoCoach"));
const Quiz = lazy(() => import("./pages/Quiz"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <RouteTracker />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/equations" element={<Equations />} />
              <Route path="/functions" element={<Functions />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/physics" element={<Physics />} />
              <Route path="/bac-math" element={<BACMath />} />
              <Route path="/bem" element={<BEM />} />
              <Route path="/bem-math" element={<BEMMath />} />
              <Route path="/bem-physics" element={<BEMPhysics />} />
              <Route path="/bac-chemistry" element={<BACChemistry />} />
              <Route path="/coach" element={<CalcoCoach />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/matrices" element={<Matrices />} />
              <Route path="/sequences" element={<Sequences />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
