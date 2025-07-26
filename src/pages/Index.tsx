import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Quick access for logged users */}
      {user && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo de volta!</h2>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')}>
                Ir para Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Gerenciar Conta
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to action for non-logged users */}
      {!user && (
        <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-6">
              Crie sua vitrine personalizada em minutos
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/auth')} variant="default">
                Começar Agora
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Fazer Login
              </Button>
            </div>
          </div>
        </section>
      )}
      
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
