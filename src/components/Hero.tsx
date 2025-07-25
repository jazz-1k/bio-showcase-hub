import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Link, Eye } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-glass border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Crie sua vitrine em minutos</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Sua loja digital
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                em um só link
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Crie uma vitrine personalizada para seus produtos e compartilhe 
              com um link único na bio do Instagram, TikTok e outras redes sociais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="glass" size="xl" className="group">
                Criar Vitrine Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Ver Exemplos
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Link className="w-5 h-5 text-white/80" />
                  <span className="text-2xl font-bold text-white">2.5k+</span>
                </div>
                <span className="text-white/70 text-sm">Links criados</span>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Eye className="w-5 h-5 text-white/80" />
                  <span className="text-2xl font-bold text-white">150k+</span>
                </div>
                <span className="text-white/70 text-sm">Visualizações</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative animate-float">
              <img 
                src={heroImage} 
                alt="Vitrine digital no smartphone" 
                className="w-full max-w-lg mx-auto rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-8 -left-8 bg-white/15 backdrop-blur-glass border border-white/20 rounded-lg p-4 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg"></div>
                <div>
                  <div className="w-16 h-3 bg-white/50 rounded mb-1"></div>
                  <div className="w-12 h-2 bg-white/30 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white/15 backdrop-blur-glass border border-white/20 rounded-lg p-4 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">+247%</div>
                <div className="text-white/70 text-xs">Vendas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;