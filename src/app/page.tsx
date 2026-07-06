import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/ProductCard';
import { HotCarousel } from '@/components/HotCarousel';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();

  // DESTACADOS = los que vos marcaste con el check "Destacado".
  // Subimos el límite a 8 para que quepan más si los marcás.
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  // EN TENDENCIA = más vendidos (sales_count > 0, de mayor a menor).
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .gt('sales_count', 0)
    .order('sales_count', { ascending: false })
    .limit(8);

  // Fallback del carrusel: si todavia no hay ventas registradas,
  // mostramos los últimos productos cargados (con stock) para que la
  // sección nunca quede vacía.
  let hotProducts = bestSellers || [];
  if (hotProducts.length === 0) {
    const { data: fallback } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false })
      .limit(8);
    hotProducts = fallback || [];
  }

  const hasFeatured = featuredProducts && featuredProducts.length > 0;

  // NUESTROS PRODUCTOS: una muestra de 6 para la home.
  // Excluimos los que ya aparecen en Destacados para no repetir.
  const featuredIds = (featuredProducts || []).map((p) => p.id);
  let sampleQuery = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  if (featuredIds.length > 0) {
    // Postgres: not in (...)
    sampleQuery = sampleQuery.not('id', 'in', `(${featuredIds.join(',')})`);
  }
  const { data: sampleProducts } = await sampleQuery;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop"
            alt="Hogar y diseño"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Todo para tu hogar
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Productos prácticos, tecnología y detalles de diseño para renovar tus espacios. Envíos a todo Paraguay.
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

      {/* En Tendencia (más vendidos) - solo si hay algo que mostrar */}
      {hotProducts.length > 0 && <HotCarousel products={hotProducts} />}

      {/* Destacados - solo si marcaste al menos uno */}
      {hasFeatured && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Destacados</h2>
              <p className="text-neutral-500 max-w-xl">Una selección especial de nuestros productos favoritos para tu día a día.</p>
            </div>
            <Link href="/productos" className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-neutral-500 transition-colors">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts!.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/productos" className="inline-flex items-center gap-1 text-sm font-medium hover:text-neutral-500 transition-colors">
              Ver todo el catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Si NO marcaste ningún destacado, mostramos una franja simple
          que invita a ver el catálogo completo (en vez de cuadros grises). */}
      {!hasFeatured && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Descubrí nuestro catálogo</h2>
          <p className="text-neutral-500 max-w-xl mx-auto mb-8">
            Explorá todos nuestros productos para el hogar, tecnología y más.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Ver Catálogo Completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* Nuestros Productos: muestra de 6 + "Ver mas" */}
      {sampleProducts && sampleProducts.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Nuestros Productos</h2>
            <p className="text-neutral-500 max-w-xl">Algunos de los productos que tenemos para vos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 px-8 py-4 rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Ver más productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Filosofía */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop"
              alt="Detalle de producto"
              className="rounded-lg object-cover w-full h-[500px]"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Nuestra Filosofía</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              En Anglic seleccionamos productos útiles, con buena relación precio-calidad, pensados para hacer más fácil y lindo tu día a día.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Compra fácil, coordinamos por WhatsApp y te lo enviamos a la puerta de tu casa en cualquier punto del país.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}