import { getRequest, postRequest } from "../../services/request";

export type SavedMapResponses = {
    imageUrl: string;
    mapData: {
        latitude: string;
        longitude: string;
    }
}

export const saveMap = (auth_token: string, image_url: string, latitude: number, longitude: number) =>
    postRequest<{}, { status: string; }>({
        path: '/api/mapData/create',
        req: {
            imageUrl: image_url,
            latitude: latitude,
            longitude: longitude
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth_token}`
        }
    })



export const getAllSavedMaps = (auth_token: string) =>
    getRequest<{}, { status: string; data: SavedMapResponses[]; message: string }>({
        path: `/api/mapData/get`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth_token}`
        }
    });

    export const getTopFrequentSaves = (auth_token: string) =>
        getRequest<{}, { status: string; data: SavedMapResponses[]; message: string }>({
            path: `/api/mapData/getTopRegions`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth_token}`
            }
        });    