import Link from 'next/link';
import { MessageCircle, Share2, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              ANGLIC.
            </Link>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              Diseño y calidez para cada rincón de tu hogar. Seleccionamos los mejores productos para transformar tus espacios con elegancia y simplicidad.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Catálogo Completo</Link></li>
              <li><Link href="/admin/login" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Acceso Administrador</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Conéctate</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                <span className="sr-only">Social</span>
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                <span className="sr-only">Chat</span>
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-center text-neutral-400">
            &copy; {new Date().getFullYear()} Anglic - Hogar & Diseño. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
