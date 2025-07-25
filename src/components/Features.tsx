import { Card } from "@/components/ui/card";
import { Palette, Smartphone, BarChart, Link2, Zap, Shield } from "lucide-react";
import editorImage from "@/assets/editor-features.jpg";
import productsImage from "@/assets/products-mockup.jpg";

const Features = () => {
  const features = [
    {
      icon: Palette,
      title: "Editor Visual",
      description: "Personalize cores, fontes e layout com nosso editor intuitivo de arrastar e soltar."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Design responsivo otimizado para dispositivos móveis e todas as telas."
    },
    {
      icon: Link2,
      title: "Link Personalizado",
      description: "Crie seu link único no formato vitrine.bio/seunome para compartilhar facilmente."
    },
    {
      icon: BarChart,
      title: "Analytics",
      description: "Acompanhe visualizações, cliques e origem do tráfego de seus visitantes."
    },
    {
      icon: Zap,
      title: "Carregamento Rápido",
      description: "Páginas otimizadas que carregam instantaneamente, mesmo em conexões lentas."
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Hospedagem confiável com SSL e proteção contra ataques maliciosos."
    }
  ];

  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Recursos Poderosos</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa para
            <span className="block text-primary">vender online</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ferramentas profissionais para criar uma vitrine digital que converte visitantes em clientes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Editor Preview */}
          <div className="relative">
            <img 
              src={editorImage} 
              alt="Editor visual intuitivo" 
              className="w-full rounded-2xl shadow-elegant"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Editor visual intuitivo
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Crie sua vitrine sem conhecimento técnico. Nosso editor permite personalizar 
              cada detalhe com simplicidade: cores, fontes, layouts e muito mais.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Drag & Drop</h4>
                  <p className="text-muted-foreground">Arrastar e soltar elementos facilmente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Preview em Tempo Real</h4>
                  <p className="text-muted-foreground">Veja as mudanças instantaneamente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Templates Prontos</h4>
                  <p className="text-muted-foreground">Comece com designs profissionais</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
          <div className="lg:order-2 relative">
            <img 
              src={productsImage} 
              alt="Catálogo de produtos" 
              className="w-full rounded-2xl shadow-elegant"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="lg:order-1">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Catálogo de produtos completo
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Adicione quantos produtos quiser com fotos, descrições, preços e links de compra. 
              Organize por categorias e facilite a navegação dos seus clientes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Produtos Ilimitados</h4>
                  <p className="text-muted-foreground">Adicione quantos produtos quiser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Links Externos</h4>
                  <p className="text-muted-foreground">Redirecione para WhatsApp, loja online ou checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Organização Simples</h4>
                  <p className="text-muted-foreground">Categorias e filtros para melhor experiência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;