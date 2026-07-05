import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { AddToCartButton } from './AddToCartButton';
import { ProductGallery } from '@/components/ProductGallery';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!product) return { title: 'Producto no encontrado | Anglic' };

  return {
    title: `${product.name} | Anglic`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Build image list: use images[] array if present, otherwise fall back to image_url
  const allImages: string[] = (product.images && product.images.length > 0)
    ? product.images
    : [product.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1000&auto=format&fit=crop'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Galería de imágenes */}
        <ProductGallery images={allImages} name={product.name} />

        {/* Info del producto */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
              {product.category}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <p className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-8">
            Gs. {product.price.toLocaleString('es-PY')}
          </p>

          <div className="prose prose-neutral dark:prose-invert mb-10">
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              {product.description || 'Sin descripción detallada. Este producto ha sido seleccionado por su excelente diseño y materiales de alta calidad, perfecto para renovar cualquier espacio.'}
            </p>
          </div>

          <div className="mb-6 flex items-center gap-4 text-sm text-neutral-500">
            {product.stock !== undefined && product.stock > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                En stock ({product.stock} unidades)
              </span>
            ) : product.stock === 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Agotado
              </span>
            ) : null}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
