import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas públicas
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

// Rutas protegidas
import AdminRoute from "@/routes/AdminRoute";

// Páginas del administrador
import AdminIndex from "@/pages/admin/Index";
import UsersAdmin from "@/pages/admin/Users";      //  coincide con tu archivo
import VendedoresAdmin from "@/pages/admin/Vendedores"; //  asegúrate de tener este archivo

// Cliente de React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          {/* Panel administrador */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminIndex />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <AdminRoute>
                <UsersAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/vendedores"
            element={
              <AdminRoute>
                <VendedoresAdmin />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
