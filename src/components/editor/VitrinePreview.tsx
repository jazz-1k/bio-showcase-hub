import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  MessageCircle, 
  Send,
  Youtube,
  Mail,
  User,
  ExternalLink
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

interface VitrinePreviewProps {
  vitrine: Vitrine;
  products: Product[];
  previewMode: 'mobile' | 'desktop';
}

export const VitrinePreview = ({ vitrine, products, previewMode }: VitrinePreviewProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'tiktok': return <Send className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
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

  const gridCols = previewMode === 'mobile' ? 'grid-cols-1' : 
    products.length > 4 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div 
      className="min-h-full overflow-hidden"
      style={{
        backgroundColor: vitrine.background_color,
        color: vitrine.text_color,
        fontFamily: vitrine.font_family || 'Inter'
      }}
    >
      <div className="p-6 space-y-6">
        {/* Header/Profile */}
        <div className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={vitrine.avatar_url} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold" style={{ color: vitrine.primary_color }}>
              {vitrine.title}
            </h1>
            {vitrine.description && (
              <p className="mt-2 text-sm opacity-80">
                {vitrine.description}
              </p>
            )}
          </div>

          {/* Social Links */}
          {vitrine.social_links && Object.keys(vitrine.social_links).length > 0 && (
            <div className="flex justify-center gap-3">
              {Object.entries(vitrine.social_links).map(([platform, value]) => (
                value && (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                    style={{ 
                      borderColor: vitrine.primary_color,
                      color: vitrine.primary_color 
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
          <div className={`grid gap-4 ${gridCols}`}>
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {product.image_url && (
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm leading-tight">
                      {product.name}
                    </h3>
                    {product.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Destaque
                      </Badge>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {product.price && (
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-bold"
                          style={{ color: vitrine.primary_color }}
                        >
                          R$ {product.price.toFixed(2)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            R$ {product.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}

                    {product.external_link && (
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ 
                          backgroundColor: vitrine.primary_color,
                          color: 'white'
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

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Nenhum produto adicionado</h3>
              <p className="text-sm text-muted-foreground">
                Adicione produtos na aba "Produtos" para vê-los aqui
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};