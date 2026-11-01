import { useMemo, useState, type ReactNode } from 'react';
import {
  TripCollectionsContext,
  type RouteUiState,
  type TripCollectionsContextValue,
} from './tripCollectionsStore';

const DEFAULT_ROUTE_STATE: RouteUiState = {
  visible: false,
  color: null,
  waypointsVisible: true,
  lineVisible: true,
};

function withDefaults(state: RouteUiState | undefined): RouteUiState {
  return { ...DEFAULT_ROUTE_STATE, ...state };
}

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
          [routeId]: { ...withDefaults(prev[routeId]), visible },
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
      setRoutesVisible: (routeIds, visible) => {
        setRouteState((prev) => {
          const next = { ...prev };
          for (const routeId of routeIds) {
            next[routeId] = { ...withDefaults(prev[routeId]), visible };
          }
          return next;
        });
        // Same top-of-stack convention as setRouteVisible above, applied to the
        // whole batch at once instead of one setRouteOrder call per route.
        setRouteOrder((prev) => {
          if (visible) {
            const toAdd = routeIds.filter((id) => !prev.includes(id));
            return [...prev, ...toAdd];
          }
          return prev.filter((id) => !routeIds.includes(id));
        });
        if (!visible) {
          setActiveRouteId((prevActive) =>
            prevActive && routeIds.includes(prevActive) ? null : prevActive,
          );
        }
      },
      setRouteColor: (routeId, color) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { ...withDefaults(prev[routeId]), color },
        })),
      setWaypointsVisible: (routeId, waypointsVisible) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { ...withDefaults(prev[routeId]), waypointsVisible },
        })),
      setLineVisible: (routeId, lineVisible) =>
        setRouteState((prev) => ({
          ...prev,
          [routeId]: { ...withDefaults(prev[routeId]), lineVisible },
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
