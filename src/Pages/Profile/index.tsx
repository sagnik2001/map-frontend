import { Tabs } from "@mantine/core"
import Navbar from "../../Components/Layout/Navbar"
import { useEffect, useState } from "react";
import SavedMapsComponents from "../../Components/SavedMapDetails";
import { notifications } from "@mantine/notifications";
import { auth } from "../../utils/firebase";
import { getAllSavedMaps, getTopFrequentSaves, SavedMapResponses } from "../../api/dashboard";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<string | null>('first');
    const [saved_maps, setSavedMaps] = useState<SavedMapResponses[]>([])


    const handleSaveMapDetails = async () => {
        const auth_token = await auth.currentUser?.getIdToken()
        if (!auth_token) {
            notifications.show({
                title: "Error",
                message: "Please login again",
                color: 'red'
            });
            return;
        }
        let mapDetailsResponse;
        if (activeTab === "first")
            mapDetailsResponse = await getAllSavedMaps(auth_token)
        else
            mapDetailsResponse = await getTopFrequentSaves(auth_token)
        if (mapDetailsResponse?.status == "200") {
            setSavedMaps(mapDetailsResponse?.data)
        }
    }

    useEffect(() => {
        handleSaveMapDetails()
    }, [activeTab])
    return (
        <div>
            <Navbar />
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow justify="center">
                    <Tabs.Tab value="first">Saved Maps</Tabs.Tab>
                    <Tabs.Tab value="second">Frequent Views</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="first"><SavedMapsComponents saved_maps={saved_maps} /></Tabs.Panel>
                <Tabs.Panel value="second"><SavedMapsComponents saved_maps={saved_maps} /></Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default ProfilePage