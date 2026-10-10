/** Lógica pura de transiciones; el cambio de stock se ejecuta en runTransaction. */
export type EstadoInventario = 'Pendiente' | 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado';
export type MovimientoInventario = 'ninguno' | 'descontar' | 'devolver';

const SIGUIENTES: Record<EstadoInventario, readonly EstadoInventario[]> = {
  Pendiente: ['Confirmado', 'Cancelado'],
  Confirmado: ['En preparación', 'Cancelado'],
  'En preparación': ['En camino', 'Cancelado'],
  'En camino': ['Entregado', 'Cancelado'],
  Entregado: [],
  Cancelado: []
};

export function transicionesDisponibles(actual: EstadoInventario): EstadoInventario[] {
  return [actual, ...(SIGUIENTES[actual] || [])];
}

export function permiteRegularizar(actual: EstadoInventario, descontado: boolean, devuelto: boolean): boolean {
  return ['Confirmado', 'En preparación', 'En camino'].includes(actual) && !descontado && !devuelto;
}

export function movimientoPorCambio(
  actual: EstadoInventario, nuevo: EstadoInventario, descontado: boolean
): MovimientoInventario {
  if (actual === nuevo) throw new Error('El pedido ya tiene ese estado.');
  if (!SIGUIENTES[actual]?.includes(nuevo)) {
    throw new Error(`No puedes cambiar un pedido de "${actual}" a "${nuevo}".`);
  }
  if (actual === 'Pendiente' && nuevo === 'Confirmado') return 'descontar';
  if (nuevo === 'Cancelado' && descontado) return 'devolver';
  return 'ninguno';
}
