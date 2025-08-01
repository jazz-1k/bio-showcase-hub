import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, Copy, Trash2, LogOut, BarChart3, Sparkles, Palette, Users } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Vitrine {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  created_at: string;
  background_color: string;
  primary_color: string;
  layout_style: string;
}

interface VitrineAnalytics {
  vitrine_id: string;
  visits_count: number;
  last_visit: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [vitrines, setVitrines] = useState<Vitrine[]>([]);
  const [analytics, setAnalytics] = useState<VitrineAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await Promise.all([loadVitrines(), loadAnalytics()]);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadVitrines = async () => {
    const { data, error } = await supabase
      .from('vitrines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas vitrines.",
        variant: "destructive"
      });
    } else {
      setVitrines(data || []);
    }
  };

  const loadAnalytics = async () => {
    const { data, error } = await supabase
      .from('vitrine_analytics')
      .select('*');

    if (!error && data) {
      setAnalytics(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const createVitrine = async () => {
    if (!user) return;

    const slug = `vitrine-${Date.now()}`;
    const { data, error } = await supabase
      .from('vitrines')
      .insert({
        user_id: user.id,
        title: 'Nova Vitrine',
        slug,
        description: 'Sua vitrine personalizada está quase pronta!'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a vitrine.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Vitrine criada!",
        description: "Agora você pode personalizar sua vitrine.",
      });
      navigate(`/editor/${data.id}`);
    }
  };

  const deleteVitrine = async (id: string) => {
    const { error } = await supabase
      .from('vitrines')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a vitrine.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Vitrine excluída com sucesso."
      });
      Promise.all([loadVitrines(), loadAnalytics()]);
    }
  };

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/v/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado! 🔗",
      description: "Compartilhe sua vitrine nas suas redes sociais."
    });
  };

  const getVitrineAnalytics = (vitrineId: string) => {
    return analytics.find(a => a.vitrine_id === vitrineId);
  };

  const totalViews = analytics.reduce((sum, a) => sum + a.visits_count, 0);
  const publishedVitrines = vitrines.filter(v => v.is_published).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Vitrine.bio
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.user_metadata?.display_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {publishedVitrines} vitrines ativas • {totalViews} visualizações
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Bem-vindo de volta! 👋
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Crie vitrines incríveis para seus produtos com nosso editor visual intuitivo
            </p>
            <Button 
              onClick={createVitrine} 
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Nova Vitrine
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{vitrines.length}</p>
                    <p className="text-xs text-muted-foreground">Vitrines Criadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{publishedVitrines}</p>
                    <p className="text-xs text-muted-foreground">Publicadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalViews}</p>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-glow/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-glow" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Pro</p>
                    <p className="text-xs text-muted-foreground">Plano Atual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vitrines Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Suas Vitrines</h3>
            {vitrines.length > 0 && (
              <Button onClick={createVitrine} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Vitrine
              </Button>
            )}
          </div>

          {vitrines.length === 0 ? (
            <Card className="text-center py-16 bg-gradient-card border-0 shadow-card">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="h-16 w-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sua primeira vitrine te espera!</h3>
                  <p className="text-muted-foreground mb-6">
                    Crie uma vitrine personalizada em minutos com nosso editor visual
                  </p>
                  <Button onClick={createVitrine} className="bg-gradient-primary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Vitrine
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vitrines.map((vitrine) => {
                const vitrineAnalytics = getVitrineAnalytics(vitrine.id);
                return (
                  <Card key={vitrine.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 shadow-card overflow-hidden">
                    {/* Vitrine Preview */}
                    <div 
                      className="h-24 relative"
                      style={{
                        background: vitrine.background_color || 'linear-gradient(135deg, hsl(270 91% 65%), hsl(320 85% 70%))'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-3 right-3">
                        <Badge variant={vitrine.is_published ? "default" : "secondary"} className="text-xs">
                          {vitrine.is_published ? 'Publicada' : 'Rascunho'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                          {vitrine.layout_style || 'Estilo padrão'}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {vitrine.title}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {vitrine.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Analytics */}
                      {vitrineAnalytics && (
                        <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{vitrineAnalytics.visits_count} views</span>
                          </div>
                          {vitrineAnalytics.last_visit && (
                            <div>
                              Último acesso: {new Date(vitrineAnalytics.last_visit).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/editor/${vitrine.id}`)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        
                        {vitrine.is_published && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/v/${vitrine.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyLink(vitrine.slug)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteVitrine(vitrine.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground font-mono">
                        vitrine.bio/v/{vitrine.slug}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;