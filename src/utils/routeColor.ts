import type { ManifestRoute } from '../types/manifest';
import type { RouteUiState } from '../context/tripCollectionsStore';

/**
 * A route's color, in priority order: a per-route override set via the
 * color picker, then the route's own manifest color, then the parent
 * collection/group's default.
 */
export function resolveRouteColor(
  routeId: string,
  route: Pick<ManifestRoute, 'color'>,
  routeState: Record<string, RouteUiState>,
  fallbackColor: string,
): string {
  return routeState[routeId]?.color ?? route.color ?? fallbackColor;
}
