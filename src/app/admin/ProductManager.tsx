'use client';

import { useState } from 'react';
import { Product } from '@/store/cart';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', image_url: '', category: '', is_featured: false
  });
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
      router.refresh();
    } else {
      alert('Error eliminando producto');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image_url: formData.image_url,
      category: formData.category,
      is_featured: formData.is_featured
    };

    const { data, error } = await supabase.from('products').insert([newProduct]).select();
    
    if (error) {
      alert('Error agregando producto: ' + error.message);
    } else if (data) {
      setProducts([data[0], ...products]);
      setIsAdding(false);
      setFormData({ name: '', description: '', price: '', stock: '', image_url: '', category: '', is_featured: false });
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border border-neutral-200 dark:border-neutral-800">
          <input required placeholder="Nombre" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required placeholder="Categoría" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          <input required type="number" step="0.01" placeholder="Precio" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          <input required type="number" placeholder="Stock" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          <input required placeholder="URL Imagen" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background md:col-span-2" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          <textarea placeholder="Descripción" className="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-background md:col-span-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
            <label htmlFor="is_featured">Destacar en la página de inicio</label>
          </div>
          
          <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Guardar Producto
          </button>
        </form>
      )}

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                </td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
