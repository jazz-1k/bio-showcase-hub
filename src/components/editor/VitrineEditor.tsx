import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from './ImageUpload';
import { User, ExternalLink, Check, AlertCircle } from 'lucide-react';

interface Vitrine {
  id: string;
  title: string;
  slug: string;
  description: string;
  avatar_url: string;
  seo_title: string;
  seo_description: string;
  social_links: any;
}

interface VitrineEditorProps {
  vitrine: Vitrine;
  onSave: (updates: Partial<Vitrine>) => void;
  isSaving: boolean;
}

export const VitrineEditor = ({ vitrine, onSave, isSaving }: VitrineEditorProps) => {
  const [formData, setFormData] = useState({
    title: vitrine.title,
    slug: vitrine.slug,
    description: vitrine.description || '',
    seo_title: vitrine.seo_title || '',
    seo_description: vitrine.seo_description || '',
    avatar_url: vitrine.avatar_url || '',
    social_links: vitrine.social_links || {}
  });
  
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const handleSave = () => {
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: url }
    }));
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug === vitrine.slug) {
      setSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    // Simular verificação de disponibilidade
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Por simplicidade, vamos considerar slugs com mais de 3 caracteres como disponíveis
    const available = slug.length > 3 && !slug.includes(' ');
    setSlugAvailable(available);
    setIsCheckingSlug(false);
  };

  const handleSlugChange = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    handleInputChange('slug', cleanSlug);
    checkSlugAvailability(cleanSlug);
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Foto de Perfil</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Adicione uma foto que represente você ou sua marca
                </p>
              </div>
            </div>
            
            <ImageUpload
              value={formData.avatar_url}
              onChange={(url) => handleInputChange('avatar_url', url)}
              placeholder="URL da sua foto de perfil"
            />
          </div>

          <div>
            <Label htmlFor="title">Título da Vitrine</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Minha Loja Online"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="slug">Link Personalizado</Label>
            <div className="space-y-2">
              <div className="flex items-center rounded-lg border bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground mr-2 font-mono">
                  vitrine.bio/v/
                </span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="meu-link-unico"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 font-mono"
                />
                {isCheckingSlug && (
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
                {slugAvailable === true && (
                  <Check className="ml-2 h-4 w-4 text-green-500" />
                )}
                {slugAvailable === false && (
                  <AlertCircle className="ml-2 h-4 w-4 text-destructive" />
                )}
              </div>
              
              {slugAvailable === false && (
                <p className="text-xs text-destructive">
                  Este link não está disponível. Tente outro.
                </p>
              )}
              {slugAvailable === true && (
                <p className="text-xs text-green-600">
                  Link disponível! ✨
                </p>
              )}
              
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">
                  Link final: {window.location.origin}/v/{formData.slug}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição/Bio</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Conte um pouco sobre você ou sua loja..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociais */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle>Redes Sociais & Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {[
              { key: 'instagram', label: 'Instagram', placeholder: '@usuario', icon: '📷' },
              { key: 'whatsapp', label: 'WhatsApp', placeholder: '+5511999999999', icon: '💬' },
              { key: 'tiktok', label: 'TikTok', placeholder: '@usuario', icon: '🎵' },
              { key: 'youtube', label: 'YouTube', placeholder: 'Canal ou @usuario', icon: '🎥' },
              { key: 'email', label: 'E-mail', placeholder: 'contato@email.com', icon: '✉️' }
            ].map(social => (
              <div key={social.key} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>{social.icon}</span>
                  {social.label}
                </Label>
                <div className="relative">
                  <Input
                    value={formData.social_links[social.key] || ''}
                    onChange={(e) => handleSocialChange(social.key, e.target.value)}
                    placeholder={social.placeholder}
                    className="pl-3"
                  />
                  {formData.social_links[social.key] && (
                    <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                      Conectado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle>SEO & Compartilhamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title">Título para Compartilhamento</Label>
            <Input
              id="seo_title"
              value={formData.seo_title}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              placeholder="Como aparecerá no WhatsApp, Instagram..."
            />
            <p className="text-xs text-muted-foreground">
              Ideal: 50-60 caracteres ({formData.seo_title.length}/60)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">Descrição para Compartilhamento</Label>
            <Textarea
              id="seo_description"
              value={formData.seo_description}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              placeholder="Descrição que aparecerá quando o link for compartilhado"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Ideal: 150-160 caracteres ({formData.seo_description.length}/160)
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Preview do Compartilhamento</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">
                {formData.seo_title || formData.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formData.seo_description || formData.description}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {window.location.origin}/v/{formData.slug}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 -mx-6 -mb-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || slugAvailable === false} 
          className="w-full bg-gradient-primary text-white hover:opacity-90"
          size="lg"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};