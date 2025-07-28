import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Vitrine {
  id: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  font_family: string;
  layout_style: string;
  custom_css: string;
}

interface StyleEditorProps {
  vitrine: Vitrine;
  onSave: (updates: Partial<Vitrine>) => void;
  isSaving: boolean;
}

const colorPresets = [
  { name: 'Clássico', colors: { bg: '#ffffff', primary: '#000000', secondary: '#666666', text: '#333333' } },
  { name: 'Azul Moderno', colors: { bg: '#f8fafc', primary: '#3b82f6', secondary: '#64748b', text: '#1e293b' } },
  { name: 'Verde Natural', colors: { bg: '#f6fdf6', primary: '#16a34a', secondary: '#65a30d', text: '#15803d' } },
  { name: 'Rosa Elegante', colors: { bg: '#fdf2f8', primary: '#ec4899', secondary: '#f472b6', text: '#be185d' } },
  { name: 'Laranja Vibrante', colors: { bg: '#fff7ed', primary: '#ea580c', secondary: '#fb923c', text: '#c2410c' } },
  { name: 'Roxo Premium', colors: { bg: '#faf5ff', primary: '#9333ea', secondary: '#a855f7', text: '#7c3aed' } },
  { name: 'Escuro', colors: { bg: '#0f172a', primary: '#60a5fa', secondary: '#94a3b8', text: '#f1f5f9' } }
];

const fontOptions = [
  { value: 'Inter', label: 'Inter (Moderno)' },
  { value: 'Roboto', label: 'Roboto (Clássico)' },
  { value: 'Open Sans', label: 'Open Sans (Legível)' },
  { value: 'Lato', label: 'Lato (Elegante)' },
  { value: 'Poppins', label: 'Poppins (Jovem)' },
  { value: 'Montserrat', label: 'Montserrat (Sofisticado)' },
  { value: 'Nunito', label: 'Nunito (Amigável)' }
];

const layoutStyles = [
  { value: 'minimal', label: 'Minimalista', description: 'Design limpo e simples' },
  { value: 'modern', label: 'Moderno', description: 'Visual contemporâneo com sombras' },
  { value: 'creative', label: 'Criativo', description: 'Layout diferenciado e ousado' },
  { value: 'elegant', label: 'Elegante', description: 'Sofisticado com detalhes refinados' }
];

export const StyleEditor = ({ vitrine, onSave, isSaving }: StyleEditorProps) => {
  const [styleData, setStyleData] = useState({
    background_color: vitrine.background_color || '#ffffff',
    primary_color: vitrine.primary_color || '#000000',
    secondary_color: vitrine.secondary_color || '#666666',
    text_color: vitrine.text_color || '#333333',
    font_family: vitrine.font_family || 'Inter',
    layout_style: vitrine.layout_style || 'minimal',
    custom_css: vitrine.custom_css || ''
  });

  const handleSave = () => {
    onSave(styleData);
  };

  const handleColorChange = (field: string, value: string) => {
    setStyleData(prev => ({ ...prev, [field]: value }));
  };

  const applyColorPreset = (preset: any) => {
    setStyleData(prev => ({
      ...prev,
      background_color: preset.bg,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      text_color: preset.text
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="typography">Tipografia</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          {/* Color Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Paletas Prontas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => applyColorPreset(preset.colors)}
                  >
                    <span className="font-medium text-sm">{preset.name}</span>
                    <div className="flex gap-1 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: preset.colors.bg }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: preset.colors.text }}
                      />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Cores Personalizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg_color">Cor de Fundo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="bg_color"
                      type="color"
                      value={styleData.background_color}
                      onChange={(e) => handleColorChange('background_color', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={styleData.background_color}
                      onChange={(e) => handleColorChange('background_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="primary_color">Cor Primária</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary_color"
                      type="color"
                      value={styleData.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={styleData.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color">Cor Secundária</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={styleData.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={styleData.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      placeholder="#666666"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text_color">Cor do Texto</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="text_color"
                      type="color"
                      value={styleData.text_color}
                      onChange={(e) => handleColorChange('text_color', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={styleData.text_color}
                      onChange={(e) => handleColorChange('text_color', e.target.value)}
                      placeholder="#333333"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="font_family">Fonte</Label>
                <Select
                  value={styleData.font_family}
                  onValueChange={(value) => setStyleData(prev => ({ ...prev, font_family: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estilo de Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {layoutStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant={styleData.layout_style === style.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-start text-left"
                    onClick={() => setStyleData(prev => ({ ...prev, layout_style: style.value }))}
                  >
                    <span className="font-medium">{style.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {style.description}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSS Personalizado</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="custom_css">CSS Customizado (Avançado)</Label>
                <Textarea
                  id="custom_css"
                  value={styleData.custom_css}
                  onChange={(e) => setStyleData(prev => ({ ...prev, custom_css: e.target.value }))}
                  placeholder="/* Adicione seu CSS personalizado aqui */&#10;.vitrine-container {&#10;  /* Seus estilos */&#10;}"
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use com cuidado: CSS inválido pode quebrar o design da vitrine
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Salvando...' : 'Salvar Estilos'}
      </Button>
    </div>
  );
};