
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Store } from '../types/models';
import { Plus, X, ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Stores: React.FC = () => {
  const { stores, addStore, updateStore, removeStore, reorderStore } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Store, 'seqNo'>>({
    id: '',
    label: '',
    city: '',
    state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.label || !formData.city || !formData.state) return;
    
    addStore(formData);
    setFormData({ id: '', label: '', city: '', state: '' });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.id || !formData.label || !formData.city || !formData.state) return;
    
    const store = stores.find(s => s.id === editingId);
    if (!store) return;
    
    updateStore({ ...formData, seqNo: store.seqNo });
    setFormData({ id: '', label: '', city: '', state: '' });
    setEditingId(null);
  };

  const startEditing = (store: Store) => {
    setEditingId(store.id);
    setFormData({
      id: store.id,
      label: store.label,
      city: store.city,
      state: store.state
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderStore(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < stores.length - 1) {
      reorderStore(index, index + 1);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stores</CardTitle>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-white"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Store
          </Button>
        </CardHeader>
        
        <CardContent>
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New Store</h3>
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
                  <label className="block text-sm font-medium mb-1">Store ID</label>
                  <Input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g. ST123"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Store Name</label>
                  <Input
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="Store name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-white">Add Store</Button>
              </div>
            </form>
          )}
          
          {editingId && (
            <form onSubmit={handleEditSubmit} className="mb-6 p-4 border border-amber-100 rounded-lg bg-amber-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Edit Store</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ id: '', label: '', city: '', state: '' });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Store ID</label>
                  <Input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g. ST123"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Store Name</label>
                  <Input
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="Store name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary text-white">Update Store</Button>
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
                  <th className="px-4 py-3 text-left font-medium">City</th>
                  <th className="px-4 py-3 text-left font-medium">State</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, index) => (
                  <tr 
                    key={store.id} 
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">{store.seqNo}</td>
                    <td className="px-4 py-3">{store.id}</td>
                    <td className="px-4 py-3">{store.label}</td>
                    <td className="px-4 py-3">{store.city}</td>
                    <td className="px-4 py-3">{store.state}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleMoveDown(index)}
                          disabled={index === stores.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => startEditing(store)}
                          disabled={!!editingId}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeStore(store.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {stores.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No stores found. Add a store to get started.
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

export default Stores;
