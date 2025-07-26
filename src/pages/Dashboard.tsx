import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, Copy, Trash2, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Vitrine {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [vitrines, setVitrines] = useState<Vitrine[]>([]);
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
      await loadVitrines();
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
        description: 'Descrição da vitrine'
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
      loadVitrines();
    }
  };

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/v/${slug}`;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Minhas Vitrines</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {user?.user_metadata?.display_name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground mt-2">
              Gerencie suas vitrines e produtos
            </p>
          </div>
          <Button onClick={createVitrine} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Vitrine
          </Button>
        </div>

        {vitrines.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>Nenhuma vitrine criada</CardTitle>
              <CardDescription>
                Comece criando sua primeira vitrine personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={createVitrine} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Criar Primeira Vitrine
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vitrines.map((vitrine) => (
              <Card key={vitrine.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vitrine.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {vitrine.description}
                      </CardDescription>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      vitrine.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vitrine.is_published ? 'Publicada' : 'Rascunho'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/editor/${vitrine.id}`)}
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
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(vitrine.slug)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Link
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteVitrine(vitrine.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    URL: /v/{vitrine.slug}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;