import { createContext } from 'react';

export interface RouteUiState {
  visible: boolean;
  color: string | null;
  waypointsVisible: boolean;
  lineVisible: boolean;
  photosVisible: boolean;
}

export interface TripCollectionsContextValue {
  routeState: Record<string, RouteUiState>;
  routeOrder: string[];
  activeRouteId: string | null;
  setRouteVisible: (routeId: string, visible: boolean) => void;
  setRoutesVisible: (routeIds: string[], visible: boolean) => void;
  setRouteColor: (routeId: string, color: string) => void;
  setWaypointsVisible: (routeId: string, visible: boolean) => void;
  setLineVisible: (routeId: string, visible: boolean) => void;
  setPhotosVisible: (routeId: string, visible: boolean) => void;
  reorderRoutes: (order: string[]) => void;
  setActiveRoute: (routeId: string | null) => void;
}

export const TripCollectionsContext = createContext<TripCollectionsContextValue | null>(null);
