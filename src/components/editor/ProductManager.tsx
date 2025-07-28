import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, GripVertical, Upload } from 'lucide-react';

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

interface ProductManagerProps {
  vitrineId: string;
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

const initialProduct = {
  name: '',
  description: '',
  price: 0,
  original_price: 0,
  image_url: '',
  external_link: '',
  button_text: 'Comprar',
  category: '',
  is_featured: false,
  stock_quantity: 0
};

export const ProductManager = ({ vitrineId, products, onProductsChange }: ProductManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(initialProduct);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price || 0,
      original_price: product.original_price || 0,
      image_url: product.image_url || '',
      external_link: product.external_link || '',
      button_text: product.button_text || 'Comprar',
      category: product.category || '',
      is_featured: product.is_featured || false,
      stock_quantity: product.stock_quantity || 0
    });
    setIsDialogOpen(true);
  };

  const saveProduct = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        vitrine_id: vitrineId,
        name: formData.name,
        description: formData.description || null,
        price: formData.price || null,
        original_price: formData.original_price || null,
        image_url: formData.image_url || null,
        external_link: formData.external_link || null,
        button_text: formData.button_text || 'Comprar',
        category: formData.category || null,
        is_featured: formData.is_featured,
        stock_quantity: formData.stock_quantity || null,
        position: editingProduct ? editingProduct.position : products.length
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        );
        onProductsChange(updatedProducts);
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        onProductsChange([...products, data]);
      }

      toast({
        title: "Sucesso",
        description: editingProduct ? "Produto atualizado!" : "Produto criado!"
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive"
      });
    } else {
      onProductsChange(products.filter(p => p.id !== productId));
      toast({
        title: "Sucesso",
        description: "Produto excluído!"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Produtos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os produtos da sua vitrine
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold mb-2">Nenhum produto criado</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comece adicionando seu primeiro produto
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {product.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {product.price && (
                            <span className="font-semibold">
                              R$ {product.price.toFixed(2)}
                            </span>
                          )}
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              Destaque
                            </Badge>
                          )}
                          {product.category && (
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Camiseta Premium"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o produto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="original_price">Preço Original (R$)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="col-span-2">
                <Label htmlFor="external_link">Link de Compra</Label>
                <Input
                  id="external_link"
                  value={formData.external_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                  placeholder="https://wa.me/5511999999999 ou link da loja"
                />
              </div>

              <div>
                <Label htmlFor="button_text">Texto do Botão</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Comprar"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Roupas, Acessórios"
                />
              </div>

              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Produto em Destaque</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={saveProduct} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Salvando...' : editingProduct ? 'Atualizar' : 'Criar Produto'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};