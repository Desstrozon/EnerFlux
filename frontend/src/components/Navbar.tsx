import { ShoppingBag, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

type UserMini = { name?: string; rol?: string };

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useState<UserMini | null>(null);

  const refreshAuth = () => {
    const raw = localStorage.getItem("user");
    setAuthUser(raw ? JSON.parse(raw) : null);
  };

  useEffect(() => {
    // Carga inicial
    refreshAuth();

    // Se dispara entre pestañas
    const onStorage = () => refreshAuth();
    window.addEventListener("storage", onStorage);

    // Se dispara en la MISMA pestaña (ver snippet de Login/Register abajo)
    const onAuthChanged = () => refreshAuth();
    window.addEventListener("auth:changed", onAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged as EventListener);
    };
  }, []);

  const isAdmin = useMemo(() => {
    const r = String(authUser?.rol ?? "").toLowerCase();
    return r === "admin" || r === "administrador";
  }, [authUser]);

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthUser(null);
    // notificar en esta pestaña (por si hay otros componentes dependientes)
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/");
  };

  // activo también para subrutas de /admin
  const active = (path: string) =>
    location.pathname === path ||
    (path === "/admin" && location.pathname.startsWith("/admin"))
      ? "text-primary font-medium"
      : "text-foreground";

  // Lógica de los botones de volver
  const isAdminRoot = location.pathname === "/admin";
  const isAdminSub =
    location.pathname.startsWith("/admin/usuarios") ||
    location.pathname.startsWith("/admin/vendedores");
  const isInAdmin = isAdminRoot || isAdminSub;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Izquierda: logo o botón volver según dónde estés */}
        {isInAdmin ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(isAdminRoot ? "/" : "/admin")}
            className="flex items-center gap-2"
            title={isAdminRoot ? "Volver al inicio" : "Volver al panel"}
          >
            <ArrowLeft className="w-4 h-4" />
            {isAdminRoot ? "Inicio" : "Panel"}
          </Button>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Enerflux</span>
          </div>
        )}

        {/* Centro: links públicos + Panel (Admin) */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Inicio</a>
          <a href="#productos" className="text-foreground hover:text-primary transition-colors">Productos</a>
          <a href="#proveedores" className="text-foreground hover:text-primary transition-colors">Proveedores</a>
          <a href="#contacto" className="text-foreground hover:text-primary transition-colors">Contacto</a>

          {isAdmin && (
            <>
              <span className="opacity-30">|</span>
              <NavLink to="/admin" className={`transition-colors ${active("/admin")}`}>
                Panel (Admin)
              </NavLink>
            </>
          )}
        </div>

        {/* Derecha: sesión */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {authUser.name} · {authUser.rol}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                <User className="h-4 w-4 mr-2" />
                Ingresar
              </Button>
              {/* IMPORTANTE: este botón lleva a /register */}
              <Button
                variant="default" // usa "default"; "cta" no existe por defecto en shadcn
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
