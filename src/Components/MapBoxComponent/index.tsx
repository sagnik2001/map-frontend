import React, { useEffect, useState, useRef, MutableRefObject, SetStateAction } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapBoxComponent.css"
import { useMapStore } from '../../store';

// Set Mapbox access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxComponent = ({ map, babylonContainerRef, capturedImage, setCapturedImage, zoom,setZoom }: {
    map: MutableRefObject<Map | null>
    babylonContainerRef: MutableRefObject<HTMLCanvasElement | null>;
    capturedImage: string | null;
    setCapturedImage: React.Dispatch<SetStateAction<string | null>>;
    zoom: number;
    setZoom : React.Dispatch<SetStateAction<number>>;

}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { mapInfoDetails, setMapInfoDetails } = useMapStore();
    const [locationFetched, setLocationFetched] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapInfoDetails({
                    lat: latitude,
                    long: longitude,
                    bounds: mapInfoDetails?.bounds
                });
                setLocationFetched(true);  // Indicate that location has been fetched
            },
            (error) => {
                console.error('Error retrieving location:', error);
                setLocationFetched(true);  // Indicate fetching done even on error
            },
            { timeout: 10000 }  // Optional: set a timeout for location fetching
        );
    }, [setMapInfoDetails]);

    // useEffect(() => {
    //     if (map.current && mapInfoDetails?.lat && mapInfoDetails?.long) {
    //         map.current.flyTo({
    //             center: [mapInfoDetails.long, mapInfoDetails.lat],
    //             essential: true  // This ensures the map moves smoothly to the new center
    //         });
    //     }
    // }, [mapInfoDetails?.lat, mapInfoDetails?.long]);
    



    // Initialize map when component mounts or lat/lng/zoom changes
    useEffect(() => {
        if (!locationFetched || map.current) return; // Initialize map only if it hasn't been initialized yet
        // if (mapContainerRef.current) { // Ensure map container ref is not null
      
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [mapInfoDetails?.long ?? 0, mapInfoDetails?.lat ?? 0],
            zoom: zoom
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on("move", () => {
            if (!map.current) return;
            const { lng, lat } = map.current.getCenter();
            const bounds = map.current.getBounds();
            if(!bounds) return;
            setMapInfoDetails({
                lat: lat,
                long: lng,
                bounds: `NorthEast: ${bounds.getNorthEast().lng}, ${bounds.getNorthEast().lat} | SouthWest: ${bounds.getSouthWest().lng}, ${bounds.getSouthWest().lat}`
            });
        });

        map.current.on("zoomend", () => {
            if (map.current) {
                setZoom(map.current.getZoom());
            }
        });

        map.current.on("load", () => {
            if (map.current) {
                map.current.resize();
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [map, zoom, setZoom, setMapInfoDetails, locationFetched]);

    return (
        <div className="mapContainer" ref={mapContainerRef} />
    );
};

export default MapboxComponent;
