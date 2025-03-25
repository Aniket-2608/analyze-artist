
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/layout/Layout";
import Stores from "./pages/Stores";
import SKUs from "./pages/SKUs";
import Planning from "./pages/Planning";
import Chart from "./pages/Chart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/stores" replace />} />
            <Route path="/stores" element={<Layout><Stores /></Layout>} />
            <Route path="/skus" element={<Layout><SKUs /></Layout>} />
            <Route path="/planning" element={<Layout><Planning /></Layout>} />
            <Route path="/chart" element={<Layout><Chart /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
