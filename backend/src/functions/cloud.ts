import cloudinary from "cloudinary"
import dotenv from "dotenv"
dotenv.config()
const cloud = cloudinary.v2

cloud.config({
    cloud_name: process.env.cloud_name as string,
    api_key: process.env.api_key as string,
    api_secret: process.env.api_secret as string
})

interface CloudResponse {
    url?: string,
    valid: boolean,
    error?: string
}

function uploadToCloud(buffer: Buffer, folder_name: string, resource_type: "raw" | "auto" | "image" | "video"): Promise<CloudResponse> {
    return new Promise((resolve) => {
        const response = cloud.uploader.upload_stream({
            resource_type: resource_type,
            folder: folder_name,
        },
            ((err, result) => {
                if (err) resolve({ url: "", valid: false, error: err.message })
                else resolve({ url: result?.secure_url as string, valid: true })
            })
        )
        response.end(buffer)
    })
}

export const uploadMultipleFiles = async (buffer: Buffer[]) => {

    const response = await Promise.allSettled(
        buffer.map(async (fileBuffer) => {
            const result = uploadToCloud(fileBuffer, "trinity_synergy_docs", "auto")
            return result;
        })
    )

    const passed: CloudResponse[] = []
    const failed: { index: number, reason: string }[] = []
    response.map((res, idx) => {
        if (res.status == "fulfilled") {
            passed.push(res.value)
        } else {
            failed.push({ index: idx, reason: res.reason })
        }
    })
    return {
        passed, failed
    }

}

export const deleteFromCloud = async (public_id: string) => {
    const deleted = await cloud.uploader.destroy(public_id, (respone) => {

    })
}


export default uploadToCloud;