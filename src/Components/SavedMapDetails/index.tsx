import { Grid } from "@mantine/core"
import {  useState } from "react"

import {  SavedMapResponses } from "../../api/dashboard"
import "./SavedMapDetails.css"
import { useDisclosure } from "@mantine/hooks"
import DisplayModal from "../DisplayModal"

const SavedMapsComponents = ({saved_maps} : {saved_maps: SavedMapResponses[] }) => {

    const [opened, { open, close }] = useDisclosure(false);
    const [zoomedDetails, setZoomDetails] = useState<SavedMapResponses>()

    const handleDisplayModal = (mapDetails: SavedMapResponses) => {
        setZoomDetails(mapDetails)
        open()
    }

   

    return (
        <div className="saved-maps-container">
            <Grid h="100vh">
                {
                    saved_maps?.map((res: SavedMapResponses) => {
                        return (
                            <Grid.Col span={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
                                <img src={res?.imageUrl} onClick={() => handleDisplayModal(res)} alt="maps" className="map-img" />
                            </Grid.Col>
                        )
                    })
                }
            </Grid>
            <DisplayModal opened={opened} close={close} zoomedDetails={zoomedDetails} />
        </div>
    )
}

export default SavedMapsComponents