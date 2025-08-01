import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Camera, Heart } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  font_family: string;
  layout_style: string;
  preview: string;
}

interface ThemeSelectorProps {
  currentTheme?: string;
  onThemeSelect: (theme: Theme) => void;
}

const themes: Theme[] = [
  {
    id: 'minimal',
    name: 'Loja Minimalista',
    description: 'Clean e elegante para produtos premium',
    icon: <Palette className="h-4 w-4" />,
    background_color: '#ffffff',
    primary_color: '#000000',
    secondary_color: '#666666',
    text_color: '#333333',
    font_family: 'Inter',
    layout_style: 'minimal',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
  },
  {
    id: 'vibrant',
    name: 'Estilo TikTok/Pop',
    description: 'Cores vibrantes para criar vitrines que chamam atenção',
    icon: <Sparkles className="h-4 w-4" />,
    background_color: '#ff6b6b',
    primary_color: '#4ecdc4',
    secondary_color: '#45b7d1',
    text_color: '#ffffff',
    font_family: 'Poppins',
    layout_style: 'vibrant',
    preview: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
  },
  {
    id: 'dark',
    name: 'Estética Dark',
    description: 'Visual moderno em tons escuros',
    icon: <Camera className="h-4 w-4" />,
    background_color: '#1a1a1a',
    primary_color: '#bb86fc',
    secondary_color: '#03dac6',
    text_color: '#ffffff',
    font_family: 'Roboto',
    layout_style: 'dark',
    preview: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 50%, #bb86fc 100%)'
  },
  {
    id: 'influencer',
    name: 'Estilo Influenciador',
    description: 'Perfeito para criadores de conteúdo',
    icon: <Heart className="h-4 w-4" />,
    background_color: '#ffeaa7',
    primary_color: '#fd79a8',
    secondary_color: '#fdcb6e',
    text_color: '#2d3436',
    font_family: 'Playfair Display',
    layout_style: 'influencer',
    preview: 'linear-gradient(135deg, #ffeaa7 0%, #fd79a8 50%, #fdcb6e 100%)'
  }
];

export const ThemeSelector = ({ currentTheme, onThemeSelect }: ThemeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Temas Prontos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onThemeSelect(theme)}
            >
              <CardContent className="p-4">
                <div
                  className="h-16 rounded-lg mb-3 relative overflow-hidden"
                  style={{ background: theme.preview }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-2 right-2">
                    {currentTheme === theme.id && (
                      <Badge variant="default" className="text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {theme.icon}
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Você pode personalizar qualquer tema após aplicá-lo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};