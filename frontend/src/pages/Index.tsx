import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ensureScrollTo } from "@/lib/scroll";
import { alertSuccess } from "@/lib/alerts";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar pago exitoso
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');
    
    if (payment === 'success' && sessionId) {
      alertSuccess('¡Pago completado!', 'Tu pedido ha sido procesado correctamente.');
      // Limpiar URL
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    // Soporta ?scroll=productos, state.scrollTo y #hash
    const sp = new URLSearchParams(location.search);
    const qsScroll = sp.get("scroll");
    const stateScroll = (location.state as any)?.scrollTo;
    const hashScroll = location.hash ? location.hash.replace("#", "") : "";

    const targetId = qsScroll || stateScroll || hashScroll;
    if (!targetId) return;

    // intenta ahora; si la sección aún no existe, ensureScrollTo esperará a que monte
    ensureScrollTo(targetId);

    // por si el showcase avisa cuando termina
    const onReady = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (!detail || detail === targetId) ensureScrollTo(targetId);
    };
    window.addEventListener("section:ready", onReady as EventListener);
    return () => window.removeEventListener("section:ready", onReady as EventListener);
  }, [location.search, location.hash, location.state]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div id="inicio">
        <Hero />
      </div>
      <Features />
      {/* esta sección ya tiene id="productos" dentro del componente */}
      <ProductShowcase />
      <Footer />
    </div>
  );
};

export default Index;
  