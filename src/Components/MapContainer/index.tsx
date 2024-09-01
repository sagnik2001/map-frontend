import { useRef, useState } from "react";
import MapboxComponent from "../MapBoxComponent";
import MapEndPointsDetails from "../MapEndpointsDetails";
import "./MapContainer.css"
import { Map } from "mapbox-gl";
import * as BABYLON from '@babylonjs/core';
import { useMapStore } from "../../store";
import Navbar from "../Layout/Navbar";
import { saveMap } from "../../api/dashboard";
import { auth } from "../../utils/firebase";
import { notifications } from "@mantine/notifications";
import { uploadImage } from "../../utils";


const MapContainer = () => {

    const babylonContainerRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const map = useRef<Map | null>(null);
    const { mapInfoDetails } = useMapStore()
    const [zoom,setZoom] = useState<number>(8);


    const saveMapDetails = async () => {
        const auth_token = await auth.currentUser?.getIdToken()
        if (!auth_token) {
            notifications.show({
                title: "Error",
                message: "Please login again",
                color: 'red'
            });
            return;
        }

        const image_url = await uploadImage(capturedImage as string)
        if (!image_url) {
            notifications.show({
                title: "Internal Error",
                message: "Please try again",
                color: 'red'
            });
            return;
        }
        const saved_data = await saveMap(auth_token as string, image_url, mapInfoDetails?.lat, mapInfoDetails?.long)
        if (saved_data?.status == "201") {
            notifications.show({
                title: "Success",
                message: "Map Details Saved Successfully",
                color: 'green',
                position: 'bottom-center',
                styles : {
                   
                }
            });
        }
        else {
            notifications.show({
                title: "Error",
                message: "Please try again",
                color: 'red',
                position: 'top-center'
            });
        }
    }

    const captureMap = () => {
        const engine = new BABYLON.Engine(babylonContainerRef.current, true);
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(babylonContainerRef.current, true);

        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // Fetch and apply texture
        fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${mapInfoDetails?.long},${mapInfoDetails?.lat},${zoom}/400x400?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result as string;
                    setCapturedImage(base64Image)
                    const texture = new BABYLON.Texture(base64Image, scene);
                    const material = new BABYLON.StandardMaterial('material1', scene);
                    material.diffuseTexture = texture;

                    // Create a box and apply the material
                    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene);
                    box.material = material;
                };
                reader.readAsDataURL(blob);
            })
            .catch((err) => {
                console.error('Error fetching the map image:', err);
            });

        engine.runRenderLoop(() => {
            scene.render();
        });

    };



    return (
        <>
            <Navbar />
            <div className="map-container">
                <MapEndPointsDetails  handleCaptureImage={() => captureMap()} saveMapDetails={saveMapDetails} capturedImage={capturedImage} babylonContainerRef={babylonContainerRef} />
                <MapboxComponent setZoom={setZoom} map={map}  zoom={zoom}  />
            </div>
        </>
    )
}

export default MapContainer