'use client';

import { useState } from 'react';
import { Product } from '@/store/cart';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Plus, Pencil, X, ImagePlus, GripVertical, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatGs } from '@/utils/format';

type FormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  sales_count: string;
  images: string[];
  category: string;
  is_featured: boolean;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
  sales_count: '0',
  images: [''],
  category: '',
  is_featured: false,
};

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    set('images', imgs);
  };

  const addImage = () => set('images', [...form.images, '']);
  const removeImage = (i: number) =>
    set('images', form.images.filter((_, idx) => idx !== i));

  // Función para subir archivo a Supabase Storage
  const handleImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error subiendo imagen: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    setImage(i, data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl mb-8 border border-neutral-200 dark:border-neutral-800 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Nombre *</label>
          <input required className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:ring-2 focus:ring-black" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Categoría</label>
          <input className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:ring-2 focus:ring-black" value={form.category} onChange={(e) => set('category', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Precio (Gs.) *</label>
          <input required type="number" step="1" className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:ring-2 focus:ring-black" value={form.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Stock *</label>
          <input required type="number" className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:ring-2 focus:ring-black" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Descripción</label>
        <textarea className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:ring-2 focus:ring-black" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      {/* Carga de Imágenes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">Fotos del producto</label>
          <button type="button" onClick={addImage} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <ImagePlus className="w-3.5 h-3.5" /> Agregar campo
          </button>
        </div>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-neutral-300 flex-shrink-0" />

              <div className="flex-1 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(i, e)}
                  disabled={uploading}
                  className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:file:text-neutral-300"
                />
                {uploading && <Loader2 className="absolute right-3 top-2 w-5 h-5 animate-spin text-neutral-400" />}
              </div>

              {img && (
                <img src={img} alt="" className="w-10 h-10 rounded object-cover border border-neutral-200" />
              )}
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)} className="p-1 text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id={`featured-${initial.name}`} checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="w-4 h-4" />
        <label htmlFor={`featured-${initial.name}`} className="text-sm">Mostrar como <strong>Destacado</strong> en el Banner</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Cancelar</button>
        <button type="submit" disabled={saving || uploading} className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mode, setMode] = useState<'idle' | 'add' | { editing: Product }>('idle');
  const router = useRouter();
  const supabase = createClient();

  const toFormData = (p: Product): FormData => ({
    name: p.name,
    description: p.description || '',
    price: String(p.price),
    stock: String(p.stock ?? ''),
    sales_count: String(p.sales_count ?? 0),
    images: (p.images && p.images.length > 0) ? p.images : [p.image_url || ''],
    category: p.category || '',
    is_featured: p.is_featured || false,
  });

  const buildPayload = (form: FormData) => {
    const validImages = form.images.filter(Boolean);
    return {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      sales_count: parseInt(form.sales_count) || 0,
      image_url: validImages[0] || '',
      images: validImages,
      category: form.category,
      is_featured: form.is_featured,
    };
  };

  const handleAdd = async (form: FormData) => {
    const { data, error } = await supabase.from('products').insert([buildPayload(form)]).select();
    if (error) alert('Error: ' + error.message);
    else if (data) { setProducts([data[0], ...products]); setMode('idle'); router.refresh(); }
  };

  const handleEdit = async (form: FormData) => {
    if (typeof mode !== 'object') return;
    const { data, error } = await supabase.from('products').update(buildPayload(form)).eq('id', mode.editing.id).select();
    if (error) alert('Error: ' + error.message);
    else if (data) { setProducts(products.map((p) => (p.id === data[0].id ? data[0] : p))); setMode('idle'); router.refresh(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) { setProducts(products.filter((p) => p.id !== id)); router.refresh(); }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        {mode === 'idle' && (
          <button onClick={() => setMode('add')} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        )}
      </div>

      {mode === 'add' && <ProductForm initial={emptyForm} onSubmit={handleAdd} onCancel={() => setMode('idle')} submitLabel="Crear Producto" />}
      {typeof mode === 'object' && <div className="mb-4"><p className="text-sm text-neutral-500 mb-3">Editando: <strong>{mode.editing.name}</strong></p><ProductForm initial={toFormData(mode.editing)} onSubmit={handleEdit} onCancel={() => setMode('idle')} submitLabel="Guardar Cambios" /></div>}

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b">
            <tr>
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium hidden sm:table-cell">Categoría</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium hidden sm:table-cell">Stock</th>
              <th className="p-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.is_featured && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Destacado</span>}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-neutral-500 hidden sm:table-cell">{product.category || '—'}</td>
                <td className="p-4 font-medium">{formatGs(Number(product.price))}</td>
                <td className="p-4 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${Number(product.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock ?? 0} uds.
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setMode({ editing: product })} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}