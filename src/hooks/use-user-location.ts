
"use client";

import { useState, useEffect } from 'react';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  displayLocation: string | null;
  error: string | null;
  loading: boolean;
};

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    displayLocation: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        displayLocation: null,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      // In a real app, you would use a reverse geocoding API here.
      // For this simulation, we'll return a static location.
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        displayLocation: "San Francisco, CA",
        error: null,
        loading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'An unknown error occurred.';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
      }
      setLocation({
        latitude: null,
        longitude: null,
        displayLocation: null,
        error: errorMessage,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
}
