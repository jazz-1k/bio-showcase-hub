import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "1 vitrine digital",
        "Até 5 produtos",
        "Link personalizado",
        "Analytics básico",
        "Suporte por email"
      ],
      cta: "Começar Grátis",
      variant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 29",
      period: "/mês",
      description: "Para vendedores sérios",
      features: [
        "3 vitrines digitais",
        "Produtos ilimitados",
        "Domínio personalizado",
        "Analytics avançado",
        "Suporte prioritário",
        "Integração com pagamentos",
        "Remoção da marca"
      ],
      cta: "Começar Teste Grátis",
      variant: "hero" as const,
      popular: true
    },
    {
      name: "Business",
      price: "R$ 79",
      period: "/mês",
      description: "Para equipes e empresas",
      features: [
        "Vitrines ilimitadas",
        "Produtos ilimitados",
        "Múltiplos domínios",
        "Analytics profissional",
        "Suporte dedicado",
        "API personalizada",
        "White label completo",
        "Integrações avançadas"
      ],
      cta: "Falar com Vendas",
      variant: "secondary" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Planos Flexíveis</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Escolha seu plano
            <span className="block text-primary">ideal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua conforme seu negócio cresce. Todos os planos incluem 14 dias de teste grátis.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 hover:scale-105 animate-slide-up ${
                plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Garantia de 30 dias - 100% do seu dinheiro de volta</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;