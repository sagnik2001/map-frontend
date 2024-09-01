import React, { useRef, useState } from "react";
import MapboxComponent from "../MapBoxComponent";
import MapEndPointsDetails from "../MapEndpointsDetails";
import "./MapContainer.css";
import { Map } from "mapbox-gl";
import * as BABYLON from '@babylonjs/core';
import { useMapStore } from "../../store";
import Navbar from "../Layout/Navbar";
import { saveMap } from "../../api/dashboard";
import { auth } from "../../utils/firebase";
import { notifications } from "@mantine/notifications";
import { uploadImage } from "../../utils";

const MapContainer: React.FC = () => {
    const babylonContainerRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [annotationPoints, setAnnotationPoints] = useState<any>(null); // You might want to define a specific type for annotations
    const map = useRef<Map | null>(null);
    const { mapInfoDetails } = useMapStore();
    const [zoom, setZoom] = useState<number>(8);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const saveMapDetails = async () => {
        const auth_token = await auth.currentUser?.getIdToken();
        if (!auth_token) {
            notifications.show({
                title: "Error",
                message: "Please login again",
                color: 'red'
            });
            return;
        }

        const image_url = await uploadImage(capturedImage as string);
        if (!image_url) {
            notifications.show({
                title: "Internal Error",
                message: "Please try again",
                color: 'red'
            });
            return;
        }
        const saved_data = await saveMap(auth_token as string, image_url, mapInfoDetails?.lat, mapInfoDetails?.long);
        if (saved_data?.status == "201") {
            notifications.show({
                title: "Success",
                message: "Map Details Saved Successfully",
                color: 'green',
                position: 'bottom-center',
            });
        } else {
            notifications.show({
                title: "Error",
                message: "Please try again",
                color: 'red',
                position: 'bottom-center'
            });
        }
    };

    const captureMap = () => {
        if (!mapContainerRef.current) return;
        const rect = mapContainerRef.current.getBoundingClientRect();
        const engine = new BABYLON.Engine(babylonContainerRef.current, true);
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(babylonContainerRef.current, true);

        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${mapInfoDetails?.long},${mapInfoDetails?.lat},${zoom}/${Math.round(rect.width)}x${Math.round(rect.height)}?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result as string;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const img = new Image();
                    img.src = base64Image;

                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;

                        if (ctx) {
                            ctx.drawImage(img, 0, 0);

                            if (annotationPoints && annotationPoints.features.length > 0) {
                                annotationPoints.features.forEach((feature: any) => {
                                    const coordinates = feature.geometry.coordinates[0];
                                    ctx.beginPath();
                                    coordinates.forEach(([lng, lat]: [number, number], index: number) => {
                                        const point = map.current?.project([lng, lat]);
                                        if (point) {
                                            const x = (point.x / map.current!.transform.width) * canvas.width;
                                            const y = (point.y / map.current!.transform.height) * canvas.height;
                                            if (index === 0) {
                                                ctx.moveTo(x, y);
                                            } else {
                                                ctx.lineTo(x, y);
                                            }
                                        }
                                    });
                                    ctx.closePath();
                                    ctx.strokeStyle = 'red';
                                    ctx.lineWidth = 2;
                                    ctx.stroke();
                                });
                            }

                            // Convert the canvas to a base64 image
                            const annotatedImage = canvas.toDataURL('image/png');
                            setCapturedImage(annotatedImage);

                            // Create a texture from the annotated image in Babylon.js
                            const texture = new BABYLON.Texture(annotatedImage, scene);
                            const material = new BABYLON.StandardMaterial('material1', scene);
                            material.diffuseTexture = texture;

                            // Create a box and apply the material
                            const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene);
                            box.material = material;
                        }
                    };
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
                <MapEndPointsDetails handleCaptureImage={captureMap} saveMapDetails={saveMapDetails} capturedImage={capturedImage} babylonContainerRef={babylonContainerRef} />
                <MapboxComponent mapContainerRef={mapContainerRef} setZoom={setZoom} map={map} zoom={zoom} setAnnotationPoints={setAnnotationPoints} />
            </div>
        </>
    );
};

export default MapContainer;
