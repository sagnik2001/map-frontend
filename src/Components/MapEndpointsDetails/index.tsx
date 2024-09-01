import { MutableRefObject } from "react"
import { useMapStore } from "../../store"
import "./MapEndPointsDetails.css"

const MapEndPointsDetails = ({ handleCaptureImage, capturedImage, babylonContainerRef, saveMapDetails }: { handleCaptureImage: () => void; saveMapDetails: () => void; capturedImage: string | null; babylonContainerRef: MutableRefObject<HTMLCanvasElement | null>; }) => {

    const { mapInfoDetails } = useMapStore()

    // const [lat, setLat] = useState<number>()
    // const [long, setLong] = useState<number>()

    // console.log(capturedImage)

    // const setCoord = () => {
    //     setMapInfoDetails({
    //         ...mapInfoDetails,
    //         lat: lat as number,
    //         long: long as number
    //     })
    // }

    return (
        <div className="map-details-box">
            {/* <div className="map-input-box">
                <input value={lat} onChange={(e) => setLat(Number(e.target.value))} placeholder="Enter Longitude" type="number" />
                <input value={long} onChange={(e) => setLong(Number(e.target.value))} placeholder="Enter Latitude" type="number" />
                <button onClick={setCoord}>
                    Submit
                </button>
            </div> */}
            <div className="map-details">
                <p>Longitude: <span>{mapInfoDetails?.long}</span></p>
                <p>Latitude: <span>{mapInfoDetails?.lat}</span></p>
                {/* <p>Visible Region: {mapInfoDetails?.bounds}</p> */}
            </div>
            <div className="captureBtnCtn">
                <button className="captureBtn" onClick={handleCaptureImage}>Capture Map Image</button>
                {
                    capturedImage && <button className="captureBtn" onClick={saveMapDetails}>Save Map Details</button>
                }
            </div>
            {/* {capturedImage && ( */}
            <canvas ref={babylonContainerRef} style={{ width: '100%', height: '450px', marginTop: '10px' }} />
            {/* )} */}
        </div>
    )
}

export default MapEndPointsDetails