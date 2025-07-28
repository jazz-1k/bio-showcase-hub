import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, Save, Share2, Smartphone, Monitor } from 'lucide-react';
import { VitrineEditor } from '@/components/editor/VitrineEditor';
import { VitrinePreview } from '@/components/editor/VitrinePreview';
import { ProductManager } from '@/components/editor/ProductManager';
import { StyleEditor } from '@/components/editor/StyleEditor';
import type { User } from '@supabase/supabase-js';

interface Vitrine {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  avatar_url: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  font_family: string;
  layout_style: string;
  social_links: any;
  seo_title: string;
  seo_description: string;
  custom_css: string;
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
  stock_quantity: number;
  position: number;
}

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [vitrine, setVitrine] = useState<Vitrine | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && id) {
      loadVitrine();
      loadProducts();
    }
  }, [user, id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
  };

  const loadVitrine = async () => {
    const { data, error } = await supabase
      .from('vitrines')
      .select('*')
      .eq('id', id)
      .eq('user_id', user?.id)
      .single();

    if (error || !data) {
      toast({
        title: "Erro",
        description: "Vitrine não encontrada.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    setVitrine(data);
    setIsLoading(false);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vitrine_id', id)
      .order('position', { ascending: true });

    if (!error && data) {
      setProducts(data);
    }
  };

  const saveVitrine = async (updates: Partial<Vitrine>) => {
    if (!vitrine) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('vitrines')
      .update(updates)
      .eq('id', vitrine.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } else {
      setVitrine({ ...vitrine, ...updates });
      setLastSaved(new Date());
      toast({
        title: "Salvo!",
        description: "Alterações salvas com sucesso.",
      });
    }
    setIsSaving(false);
  };

  const publishVitrine = async () => {
    await saveVitrine({ is_published: !vitrine?.is_published });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/v/${vitrine?.slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link da vitrine foi copiado para a área de transferência."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vitrine) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="font-semibold">{vitrine.title}</h1>
              <p className="text-xs text-muted-foreground">
                Salvo em {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={copyLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/v/${vitrine.slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>

            <Button
              onClick={publishVitrine}
              disabled={isSaving}
              className={vitrine.is_published ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              {vitrine.is_published ? 'Despublicar' : 'Publicar'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        <div className="w-1/2 border-r overflow-y-auto">
          <Tabs defaultValue="content" className="h-full">
            <TabsList className="grid grid-cols-3 w-full rounded-none border-b">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="style">Visual</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="p-6 space-y-6">
              <VitrineEditor
                vitrine={vitrine}
                onSave={saveVitrine}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="products" className="p-6">
              <ProductManager
                vitrineId={vitrine.id}
                products={products}
                onProductsChange={setProducts}
              />
            </TabsContent>

            <TabsContent value="style" className="p-6 space-y-6">
              <StyleEditor
                vitrine={vitrine}
                onSave={saveVitrine}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 bg-muted/30 overflow-y-auto">
          <div className="p-6">
            <div className={`mx-auto transition-all duration-300 ${
              previewMode === 'mobile' 
                ? 'w-80 border rounded-2xl bg-background shadow-xl' 
                : 'w-full'
            }`}>
              <VitrinePreview
                vitrine={vitrine}
                products={products}
                previewMode={previewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;