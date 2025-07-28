import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar">Foto de Perfil</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="avatar"
                  placeholder="URL da imagem"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
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

          <div>
            <Label htmlFor="slug">Link Personalizado</Label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">
                {window.location.origin}/v/
              </span>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="meu-link"
                className="flex-1"
              />
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
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'instagram', label: 'Instagram', placeholder: '@usuario' },
            { key: 'whatsapp', label: 'WhatsApp', placeholder: '+5511999999999' },
            { key: 'tiktok', label: 'TikTok', placeholder: '@usuario' },
            { key: 'youtube', label: 'YouTube', placeholder: 'Canal ou @usuario' },
            { key: 'email', label: 'E-mail', placeholder: 'contato@email.com' }
          ].map(social => (
            <div key={social.key}>
              <Label>{social.label}</Label>
              <Input
                value={formData.social_links[social.key] || ''}
                onChange={(e) => handleSocialChange(social.key, e.target.value)}
                placeholder={social.placeholder}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Compartilhamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seo_title">Título para Compartilhamento</Label>
            <Input
              id="seo_title"
              value={formData.seo_title}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              placeholder="Como aparecerá no WhatsApp, Instagram..."
            />
          </div>

          <div>
            <Label htmlFor="seo_description">Descrição para Compartilhamento</Label>
            <Textarea
              id="seo_description"
              value={formData.seo_description}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              placeholder="Descrição que aparecerá quando o link for compartilhado"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );
};