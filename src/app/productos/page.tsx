import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/ProductCard';

export const metadata = {
  title: 'Catálogo | Anglic - Hogar & Diseño',
  description: 'Explora nuestra colección completa de productos de diseño y decoración.',
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
          Explora todas nuestras categorías y encuentra el detalle perfecto para renovar tus espacios.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-neutral-500">
            <p>No se encontraron productos por el momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
