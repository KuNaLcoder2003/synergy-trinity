import cloudinary from "cloudinary"

const cloud = cloudinary.v2

cloud.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
})

interface CloudResponse {
    url?: string,
    valid: boolean,
    error?: string
}

function uploadToCloud(buffer: Buffer[], folder_name: string, resource_type: "raw" | "auto" | "image" | "video"): Promise<CloudResponse> {
    return new Promise((resolve) => {
        const response = cloud.uploader.upload_stream({
            resource_type: "auto",
            folder: "",
        },
            ((err, result) => {
                if (err) resolve({ url: "", valid: false, error: err.message })
                else resolve({ url: result?.secure_url as string, valid: true })
            })
        )
        response.end(buffer)
    })
}


export default uploadToCloud;