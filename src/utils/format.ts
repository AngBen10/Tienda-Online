// Formato de precio en guaraníes (Paraguay).
// Ej: formatGs(259000) => "Gs. 259.000"
export function formatGs(value: number | string): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (isNaN(n)) return 'Gs. 0';
  return 'Gs. ' + n.toLocaleString('es-PY');
}
