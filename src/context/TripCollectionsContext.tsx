import { useMemo, useState, type ReactNode } from 'react';
import {
  TripCollectionsContext,
  type RouteUiState,
  type TripCollectionsContextValue,
} from './tripCollectionsStore';

// TODO: persist routeState/routeOrder to localStorage so customizations survive a reload.
export function TripCollectionsProvider({ children }: { children: ReactNode }) {
  const [routeState, setRouteState] = useState<Record<string, RouteUiState>>({});
  const [routeOrder, setRouteOrder] = useState<string[]>([]);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  const value = useMemo<TripCollectionsContextValue>(
    () => ({
      routeState,
      routeOrder,
      activeRouteId,
      setRouteVisible: (routeId, visible) => {
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { color: prev[routeId]?.color ?? null, visible },
        }));
        // routeOrder[0] is the top of the visual stack; it only ever tracks
        // currently-visible routes, so the first route turned on stays on top
        // and later ones stack up underneath it (a hidden route drops out
        // entirely and goes to the bottom if re-shown later).
        setRouteOrder((prev) => {
          if (visible) {
            return prev.includes(routeId) ? prev : [...prev, routeId];
          }
          return prev.filter((id) => id !== routeId);
        });
        if (!visible) {
          setActiveRouteId((prev) => (prev === routeId ? null : prev));
        }
      },
      setRouteColor: (routeId, color) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { visible: prev[routeId]?.visible ?? false, color },
        })),
      reorderRoutes: setRouteOrder,
      setActiveRoute: setActiveRouteId,
    }),
    [routeState, routeOrder, activeRouteId],
  );

  return (
    <TripCollectionsContext.Provider value={value}>{children}</TripCollectionsContext.Provider>
  );
}
