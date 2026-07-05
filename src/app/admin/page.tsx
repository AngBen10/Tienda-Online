import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProductManager } from './ProductManager';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-neutral-500">Gestiona los productos de tu tienda (Usuario: {user.email})</p>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm font-medium hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>

      <ProductManager initialProducts={products || []} />
    </div>
  );
}
