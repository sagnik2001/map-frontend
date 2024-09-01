import React, { useEffect, useState, useRef, MutableRefObject, SetStateAction } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import "./MapBoxComponent.css";
import { useMapStore } from '../../store';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxComponent = ({ map, zoom, setZoom, setAnnotationPoints,mapContainerRef }: {
    map: MutableRefObject<Map | null>,
    zoom: number,
    setZoom: React.Dispatch<SetStateAction<number>>,
    setAnnotationPoints: React.Dispatch<SetStateAction<any>>,
    mapContainerRef : MutableRefObject<HTMLDivElement | null>
}) => {
    const { mapInfoDetails, setMapInfoDetails } = useMapStore();
    const [locationFetched, setLocationFetched] = useState(false);
    const draw = useRef<MapboxDraw | null>(null); // Store the Mapbox Draw instance

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapInfoDetails({
                    lat: latitude,
                    long: longitude,
                    bounds: mapInfoDetails?.bounds
                });
                setLocationFetched(true);
            },
            (error) => {
                console.error('Error retrieving location:', error);
                setLocationFetched(true);
            },
            { timeout: 10000 }
        );
    }, [setMapInfoDetails]);

    // Define updateAnnotations function before using it
    const updateAnnotations = () => {
        if (draw.current) {
            const annotations = draw.current.getAll();
            setAnnotationPoints(annotations);
        }
    };

    useEffect(() => {
        if (!locationFetched || map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [mapInfoDetails?.long ?? 0, mapInfoDetails?.lat ?? 0],
            zoom: zoom
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Initialize Mapbox Draw
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
        });
        map.current.addControl(draw.current);

        map.current.on("move", () => {
            if (!map.current) return;
            const { lng, lat } = map.current.getCenter();
            const bounds = map.current.getBounds();
            if (!bounds) return;
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

        // Attach event listeners after defining the updateAnnotations function
        map.current.on("draw.create", updateAnnotations);
        map.current.on("draw.update", updateAnnotations);
        map.current.on("draw.delete", updateAnnotations);

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
