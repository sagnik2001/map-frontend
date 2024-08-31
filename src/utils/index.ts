
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function base64ToBlob(base64: string, mime: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mime});
}



export const uploadImage = async (base64Image: string): Promise<string | undefined> => {
    console.log("here")
    const imageBlob = base64ToBlob(base64Image, 'image/jpeg'); // Ensure MIME type is correctly set based on your image's format
    const storageRef = ref(storage, `images/${Date.now()}`); // Use template literal for clarity

    try {
        const snapshot = await uploadBytes(storageRef, imageBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        return undefined; // Explicitly return undefined on error
    }
}


export function convertImageToBase64(url : string) {
    return fetch(url)
        .then(response => {
            // Ensure the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();  // Retrieve the image as a Blob
        })
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);  // Resolve the promise with the Base64 string
                reader.onerror = reject;  // Reject the promise on error
                reader.readAsDataURL(blob);  // Read the blob as a Data URL
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}



