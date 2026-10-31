import { useContext } from 'react';
import {
  TripCollectionsContext,
  type TripCollectionsContextValue,
} from '../context/tripCollectionsStore';

export function useTripCollections(): TripCollectionsContextValue {
  const ctx = useContext(TripCollectionsContext);
  if (!ctx) {
    throw new Error('useTripCollections must be used within a TripCollectionsProvider');
  }
  return ctx;
}
