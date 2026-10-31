import { createContext } from 'react';

export interface RouteUiState {
  visible: boolean;
  color: string | null;
}

export interface TripCollectionsContextValue {
  routeState: Record<string, RouteUiState>;
  routeOrder: string[];
  setRouteVisible: (routeId: string, visible: boolean) => void;
  setRouteColor: (routeId: string, color: string) => void;
  reorderRoutes: (order: string[]) => void;
}

export const TripCollectionsContext = createContext<TripCollectionsContextValue | null>(null);
