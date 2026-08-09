import { redirect } from 'next/navigation';

export default function ProductosPage() {
  // Si Vercel o un usuario entra aquí, lo mandamos al inicio inmediatamente
  redirect('/');
}