'use client';

import { useState } from 'react';
import { Product } from '@/store/cart';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Plus, Pencil, X, ImagePlus, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  images: string[];
  category: string;
  is_featured: boolean;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            Nombre *
          </label>
          <input
            required
            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            Categoría
          </label>
          <input
            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            Precio *
          </label>
          <input
            required
            type="number"
            step="0.01"
            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            Stock *
          </label>
          <input
            required
            type="number"
            className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
          Descripción
        </label>
        <textarea
          className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Fotos del producto (URLs)
          </label>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Agregar foto
          </button>
        </div>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-neutral-300 flex-shrink-0" />
              <input
                type="url"
                placeholder={i === 0 ? 'URL de foto principal (obligatoria)' : `URL de foto ${i + 1}`}
                required={i === 0}
                className="flex-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                value={img}
                onChange={(e) => setImage(i, e.target.value)}
              />
              {/* Preview */}
              {img && (
                <img
                  src={img}
                  alt=""
                  className="w-10 h-10 rounded object-cover border border-neutral-200 flex-shrink-0"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1 text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`featured-${initial.name}`}
          checked={form.is_featured}
          onChange={(e) => set('is_featured', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor={`featured-${initial.name}`} className="text-sm">
          Mostrar como <strong>Destacado</strong> en la página de inicio
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

// -------------------------------------------------------

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
      image_url: validImages[0] || '',
      images: validImages,
      category: form.category,
      is_featured: form.is_featured,
    };
  };

  const handleAdd = async (form: FormData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([buildPayload(form)])
      .select();
    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      setProducts([data[0], ...products]);
      setMode('idle');
      router.refresh();
    }
  };

  const handleEdit = async (form: FormData) => {
    if (typeof mode !== 'object') return;
    const { data, error } = await supabase
      .from('products')
      .update(buildPayload(form))
      .eq('id', mode.editing.id)
      .select();
    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      setProducts(products.map((p) => (p.id === data[0].id ? data[0] : p)));
      setMode('idle');
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
      router.refresh();
    } else {
      alert('Error eliminando: ' + error.message);
    }
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex justify-end mb-6">
        {mode === 'idle' && (
          <button
            onClick={() => setMode('add')}
            className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Add form */}
      {mode === 'add' && (
        <ProductForm
          initial={emptyForm}
          onSubmit={handleAdd}
          onCancel={() => setMode('idle')}
          submitLabel="Crear Producto"
        />
      )}

      {/* Edit form */}
      {typeof mode === 'object' && (
        <div className="mb-4">
          <p className="text-sm text-neutral-500 mb-3">
            Editando: <strong>{mode.editing.name}</strong>
          </p>
          <ProductForm
            initial={toFormData(mode.editing)}
            onSubmit={handleEdit}
            onCancel={() => setMode('idle')}
            submitLabel="Guardar Cambios"
          />
        </div>
      )}

      {/* Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
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
              <tr
                key={product.id}
                className={`transition-colors ${typeof mode === 'object' && mode.editing.id === product.id ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50'}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[160px]">{product.name}</p>
                      {product.is_featured && (
                        <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-neutral-500 hidden sm:table-cell">
                  {product.category || '—'}
                </td>
                <td className="p-4 font-medium">${Number(product.price).toLocaleString()}</td>
                <td className="p-4 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${Number(product.stock) > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {product.stock ?? 0} uds.
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setMode({ editing: product })}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500">
                  No hay productos registrados. ¡Crea el primero!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
