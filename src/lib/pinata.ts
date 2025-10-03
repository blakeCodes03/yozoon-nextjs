import { PinataSDK } from "pinata-web3";



const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not defined in the environment");
}

if (!PINATA_GATEWAY_URL) {
    throw new Error("PINATA_GATEWAY_URL is not defined in the environment");
}

if (!SITE_NAME) {
    throw new Error("SITE_NAME is not defined in the environment");
}

if (!SITE_URL) {
    throw new Error("SITE_URL is not defined in the environment");
}


// Initialize Pinata SDK
const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: PINATA_GATEWAY_URL,
});

interface PinataUploadOptions {
    name: string;
    symbol: string;
    description: string;
    image?: string;
}

interface yozoonUri {
    name: string;
    symbol: string;
    description: string;
    imageUri?: string;
}



// Utility function to convert base64 to File
export function base64ToFile(base64: string, filename: string, type: string) {
    const arr = base64.split(",");
    const mime = type || arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}

// Upload function
export async function uploadToPinata(options: PinataUploadOptions) {
    const { name, symbol, description, image } = options;

    if (!image) {
        throw new Error("No image selected!");
    }

    const file = base64ToFile(image, "uploaded_image.png", "image/png");

    try {
        const imageUpload = await pinata.upload.file(file);

        if (!imageUpload.IpfsHash) return null;

        const imageUri = `https://ipfs.io/ipfs/${imageUpload.IpfsHash}`;

        const metadata = {
            name,
            symbol,
            description: description || "No description",
            image: imageUri,
            creator: { name: SITE_NAME, site: SITE_URL },
           

        };

        const uniqueNumber = Date.now();
        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
        const jsonFile = new File([jsonBlob], `uri_${uniqueNumber}.json`, { type: "application/json" });

        const jsonUpload = await pinata.upload.file(jsonFile);
        if (!jsonUpload?.IpfsHash) return null;

        return { uri: `https://ipfs.io/ipfs/${jsonUpload.IpfsHash}`, image: imageUri };
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}


export async function uploadYozoonUri(options: yozoonUri) {
    const { name, symbol, description, imageUri } = options;

    if (!imageUri) {
        throw new Error("No image URL!");
    }

    try {

        const metadata = {
            name,
            symbol,
            description: description || "No description",
            image: imageUri,
            creator: { name: SITE_NAME, site: SITE_URL },

        };

        const uniqueNumber = Date.now();
        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
        const jsonFile = new File([jsonBlob], `uri_${uniqueNumber}.json`, { type: "application/json" });

        const jsonUpload = await pinata.upload.file(jsonFile);
        if (!jsonUpload?.IpfsHash) return null;

        return `https://ipfs.io/ipfs/${jsonUpload.IpfsHash}`;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}