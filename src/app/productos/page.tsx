import { createClient } from '@/utils/supabase/server';
import { CatalogGrid } from '@/components/CatalogGrid';

export const metadata = {
  title: 'Catálogo | Anglic - Hogar & Diseño',
  description: 'Explora nuestra colección completa de productos para el hogar y más.',
};

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Catálogo Completo</h1>
        <p className="text-neutral-500 max-w-2xl">
          Explora todas nuestras categorías y encontrá lo que buscás para tu hogar.
        </p>
      </div>

      <CatalogGrid products={products || []} />
    </div>
  );
}