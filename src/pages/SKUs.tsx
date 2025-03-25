
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SKU } from '../types/models';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SKUs: React.FC = () => {
  const { skus, addSku, updateSku, removeSku } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<SKU, 'seqNo'>>({
    id: '',
    label: '',
    price: 0,
    cost: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['price', 'cost'];
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value 
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.label) return;
    
    addSku(formData);
    setFormData({ id: '', label: '', price: 0, cost: 0 });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.id || !formData.label) return;
    
    const sku = skus.find(s => s.id === editingId);
    if (!sku) return;
    
    updateSku({ ...formData, seqNo: sku.seqNo });
    setFormData({ id: '', label: '', price: 0, cost: 0 });
    setEditingId(null);
  };

  const startEditing = (sku: SKU) => {
    setEditingId(sku.id);
    setFormData({
      id: sku.id,
      label: sku.label,
      price: sku.price,
      cost: sku.cost
    });
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SKUs</CardTitle>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-white"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4 mr-2" /> Add SKU
          </Button>
        </CardHeader>
        
        <CardContent>
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New SKU</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU ID</label>
                  <Input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g. SKU001"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">SKU Name</label>
                  <Input
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="SKU name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost ($)</label>
                  <Input
                    name="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-white">Add SKU</Button>
              </div>
            </form>
          )}
          
          {editingId && (
            <form onSubmit={handleEditSubmit} className="mb-6 p-4 border border-amber-100 rounded-lg bg-amber-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Edit SKU</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ id: '', label: '', price: 0, cost: 0 });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU ID</label>
                  <Input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g. SKU001"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">SKU Name</label>
                  <Input
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="SKU name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost ($)</label>
                  <Input
                    name="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-white">Update SKU</Button>
              </div>
            </form>
          )}
          
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="px-4 py-3 text-left font-medium">Seq No.</th>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Label</th>
                  <th className="px-4 py-3 text-right font-medium">Price ($)</th>
                  <th className="px-4 py-3 text-right font-medium">Cost ($)</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => (
                  <tr 
                    key={sku.id} 
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">{sku.seqNo}</td>
                    <td className="px-4 py-3">{sku.id}</td>
                    <td className="px-4 py-3">{sku.label}</td>
                    <td className="px-4 py-3 text-right">{sku.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{sku.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => startEditing(sku)}
                          disabled={!!editingId}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeSku(sku.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {skus.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No SKUs found. Add a SKU to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SKUs;
