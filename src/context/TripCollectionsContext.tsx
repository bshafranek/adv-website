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

  const value = useMemo<TripCollectionsContextValue>(
    () => ({
      routeState,
      routeOrder,
      setRouteVisible: (routeId, visible) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { color: prev[routeId]?.color ?? null, visible },
        })),
      setRouteColor: (routeId, color) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { visible: prev[routeId]?.visible ?? false, color },
        })),
      reorderRoutes: setRouteOrder,
    }),
    [routeState, routeOrder],
  );

  return (
    <TripCollectionsContext.Provider value={value}>{children}</TripCollectionsContext.Provider>
  );
}
