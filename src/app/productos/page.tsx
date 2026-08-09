import { createClient } from '@/utils/supabase/server';
import { CatalogGrid } from '@/components/CatalogGrid';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export const metadata = {
  title: 'Catálogo | Hidrotec',
  description: 'Explora nuestra producción hidropónica premium.',
};

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botón para volver a la portada */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg font-medium transition-colors mb-10"
      >
        <Home className="w-4 h-4" />
        Volver a la página principal
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Catálogo Completo</h1>
        <p className="text-neutral-500 max-w-2xl">
          Explora nuestra producción hidropónica y encontrá calidad premium directa del invernadero a tu mesa.
        </p>
      </div>

      <CatalogGrid products={products || []} />
    </div>
  );
}