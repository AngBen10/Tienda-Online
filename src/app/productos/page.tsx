import { createClient } from '@/utils/supabase/server';
import { CatalogClient } from './CatalogClient';

export const metadata = {
  title: 'Catálogo | Anglic - Hogar, Tecnología & Diseño',
  description: 'Explora nuestra colección completa de productos de hogar, tecnología y diseño.',
};

export default async function CatalogPage() {
  const supabase = await createClient();
  
  // Fetch all products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Catálogo Completo</h1>
        <p className="text-neutral-500 max-w-2xl">
          Explorá todas nuestras categorías y encontrá el producto perfecto para tu hogar, tecnología y estilo de vida.
        </p>
      </div>

      <CatalogClient products={products || []} />
    </div>
  );
}
