import { createContext } from 'react';

export interface RouteUiState {
  visible: boolean;
  color: string | null;
}

export interface TripCollectionsContextValue {
  routeState: Record<string, RouteUiState>;
  routeOrder: string[];
  activeRouteId: string | null;
  setRouteVisible: (routeId: string, visible: boolean) => void;
  setRouteColor: (routeId: string, color: string) => void;
  reorderRoutes: (order: string[]) => void;
  setActiveRoute: (routeId: string | null) => void;
}

export const TripCollectionsContext = createContext<TripCollectionsContextValue | null>(null);
