import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { 
  Instagram, 
  MessageCircle, 
  Send,
  Youtube,
  Mail,
  User,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

interface Vitrine {
  id: string;
  title: string;
  description: string;
  avatar_url: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  font_family: string;
  layout_style: string;
  social_links: any;
  custom_css: string;
  is_published: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  external_link: string;
  button_text: string;
  category: string;
  is_featured: boolean;
}

const VitrinePublic = () => {
  const { slug } = useParams();
  const [vitrine, setVitrine] = useState<Vitrine | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadVitrine();
  }, [slug]);

  const loadVitrine = async () => {
    const { data: vitrineData, error: vitrineError } = await supabase
      .from('vitrines')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (vitrineError || !vitrineData) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setVitrine(vitrineData);

    // Load products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('vitrine_id', vitrineData.id)
      .order('position', { ascending: true });

    if (productsData) {
      setProducts(productsData);
    }

    setIsLoading(false);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'whatsapp': return <MessageCircle className="h-5 w-5" />;
      case 'tiktok': return <Send className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getSocialUrl = (platform: string, value: string) => {
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${value.replace('@', '')}`;
      case 'whatsapp':
        return `https://wa.me/${value.replace(/\D/g, '')}`;
      case 'tiktok':
        return `https://tiktok.com/@${value.replace('@', '')}`;
      case 'youtube':
        return value.startsWith('http') ? value : `https://youtube.com/@${value.replace('@', '')}`;
      case 'email':
        return `mailto:${value}`;
      default:
        return value.startsWith('http') ? value : `https://${value}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Vitrine não encontrada</h2>
            <p className="text-muted-foreground">
              Esta vitrine não existe ou não está publicada.
            </p>
          </div>
          <Button onClick={() => window.location.href = '/'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  if (!vitrine) return null;

  return (
    <>
      {/* Custom CSS */}
      {vitrine.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: vitrine.custom_css }} />
      )}
      
      <div 
        className="min-h-screen vitrine-container"
        style={{
          backgroundColor: vitrine.background_color,
          color: vitrine.text_color,
          fontFamily: vitrine.font_family || 'Inter'
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <div className="space-y-8">
            {/* Header/Profile */}
            <div className="text-center space-y-6">
              <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage src={vitrine.avatar_url} />
                <AvatarFallback className="text-2xl">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: vitrine.primary_color }}
                >
                  {vitrine.title}
                </h1>
                {vitrine.description && (
                  <p className="text-lg leading-relaxed opacity-90">
                    {vitrine.description}
                  </p>
                )}
              </div>

              {/* Social Links */}
              {vitrine.social_links && Object.keys(vitrine.social_links).length > 0 && (
                <div className="flex justify-center gap-4">
                  {Object.entries(vitrine.social_links).map(([platform, value]) => (
                    value && (
                      <Button
                        key={platform}
                        variant="outline"
                        size="lg"
                        className="h-12 w-12 p-0 rounded-full"
                        style={{ 
                          borderColor: vitrine.primary_color,
                          color: vitrine.primary_color,
                          backgroundColor: 'transparent'
                        }}
                        onClick={() => window.open(getSocialUrl(platform, value as string), '_blank')}
                      >
                        {getSocialIcon(platform)}
                      </Button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {products.length > 0 && (
              <div className="grid gap-6">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      vitrine.layout_style === 'modern' ? 'shadow-lg' : ''
                    } ${
                      vitrine.layout_style === 'elegant' ? 'border-2' : ''
                    }`}
                    style={{
                      borderColor: vitrine.layout_style === 'elegant' ? vitrine.secondary_color : undefined
                    }}
                  >
                    {product.image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-xl leading-tight">
                          {product.name}
                        </h3>
                        {product.is_featured && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: vitrine.primary_color,
                              color: 'white'
                            }}
                          >
                            Destaque
                          </Badge>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-sm opacity-80 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      <div className="space-y-4">
                        {product.price && (
                          <div className="flex items-center gap-3">
                            <span 
                              className="text-2xl font-bold"
                              style={{ color: vitrine.primary_color }}
                            >
                              R$ {product.price.toFixed(2)}
                            </span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-lg text-muted-foreground line-through">
                                R$ {product.original_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        {product.external_link && (
                          <Button 
                            size="lg" 
                            className="w-full text-lg font-semibold py-6 rounded-xl"
                            style={{ 
                              backgroundColor: vitrine.primary_color,
                              color: 'white',
                              borderColor: vitrine.primary_color
                            }}
                            onClick={() => window.open(product.external_link, '_blank')}
                          >
                            {product.button_text || 'Comprar'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 pb-4">
              <p className="text-xs opacity-60">
                Criado com ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VitrinePublic;