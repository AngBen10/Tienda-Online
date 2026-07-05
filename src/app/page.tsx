import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import { HotCarousel } from '@/components/HotCarousel';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);

  // Fetch hot products (latest 10 with stock > 0)
  const { data: hotProducts } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop"
            alt="Interior design"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Redefiniendo tu espacio
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Descubrí nuestra selección de productos de hogar, tecnología y diseño — todo lo que tu espacio necesita en un solo lugar.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors"
            >
              Explorar Catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hot / En Tendencia Section */}
      <HotCarousel products={hotProducts || []} />

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Destacados</h2>
            <p className="text-neutral-500 max-w-xl">Selección especial de nuestras piezas favoritas que transformarán cualquier ambiente.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-neutral-500 transition-colors">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-neutral-200 dark:bg-neutral-800 aspect-square w-full rounded-lg" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/productos" className="inline-flex items-center gap-1 text-sm font-medium hover:text-neutral-500 transition-colors">
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop"
              alt="Detalle minimalista"
              className="rounded-lg object-cover w-full h-[500px]"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Nuestra Filosofía</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              En Anglic creemos que el diseño no debe ser complicado. Buscamos la belleza en la simplicidad, seleccionando materiales nobles y formas puras.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Cada objeto en nuestra colección está pensado para aportar no solo estética, sino también funcionalidad y calidez a los espacios que habitas a diario.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
