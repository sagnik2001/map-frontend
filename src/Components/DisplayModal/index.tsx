import { Modal } from "@mantine/core"
import "./DisplayModal.css"
import { useEffect, useRef } from "react";

const DisplayModal = ({ opened, close, zoomedDetails }: any) => {



    return (
        <Modal opened={opened} onClose={close} title="Map Details" size="xl" centered>
            <div className="model-container">
                <img src={zoomedDetails?.imageUrl} alt="imgUrl" />
                <div className="model-map-details">
                    <p>Longitude: <span>{zoomedDetails?.mapData?.longitude}</span></p>
                    <p>Latitude: <span>{zoomedDetails?.mapData?.latitude}</span></p>
                    {/* <p>Visible Region: {mapInfoDetails?.bounds}</p> */}
                </div>
            </div>
        </Modal>
    )
}

export default DisplayModal