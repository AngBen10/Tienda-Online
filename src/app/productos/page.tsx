import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { AddToCartButton } from './AddToCartButton';
import { ProductGallery } from '@/components/ProductGallery';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { formatGs } from '@/utils/format';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('id', id)
    .single();

  if (!product) return { title: 'Producto no encontrado | Hidrotec' };

  return {
    title: `${product.name} | Hidrotec`,
    description: product.description || 'Cultivo hidropónico premium.',
    openGraph: {
      title: `${product.name} | Hidrotec`,
      description: product.description || 'Cultivo hidropónico premium.',
      images: product.image_url ? [product.image_url] : undefined,
    },
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

  const allImages: string[] = (product.images && product.images.length > 0)
    ? product.images
    : [product.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1000&auto=format&fit=crop'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Volver al inicio directamente */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-green-600 transition-colors mb-8 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-lg font-medium"
      >
        <Home className="w-4 h-4" />
        Volver al inicio
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <ProductGallery images={allImages} name={product.name} />

        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
              {product.category}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <p className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-8">
            {formatGs(product.price)}
          </p>

          <div className="prose prose-neutral dark:prose-invert mb-10">
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              {product.description || 'Producto cultivado de manera hidropónica, seleccionado por su alta calidad y frescura. Ideal para negocios o consumo diario.'}
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