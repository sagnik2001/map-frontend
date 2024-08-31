import { create } from 'zustand'

type MapInforDetails = {
    lat: number;
    long: number;
    bounds: string;
}

export type MapStoreType = {
    mapInfoDetails: MapInforDetails
    setMapInfoDetails: (mapInfoDetails: MapInforDetails) => void;
}

export const useMapStore = create<MapStoreType>((set) => ({
    mapInfoDetails: {
        lat: 0,
        long: 0,
        bounds: "",
    },
    setMapInfoDetails: (mapInfoDetails) => set({ mapInfoDetails })
}))