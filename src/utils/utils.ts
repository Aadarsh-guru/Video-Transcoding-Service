import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3BucketName, s3Client } from "../config/config";


// utility funtion to upload video to s3 bucket
const uploadToS3 = async (body: any, key: string, contentType: string) => {
    try {
        const command = new PutObjectCommand({
            Bucket: s3BucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        await s3Client.send(command);
        return `https://${s3BucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
        throw error;
    }
};


// utility funtion to delete video from the s3 bucket
const deleteFromS3 = async (url: string) => {
    try {
        if (!url.startsWith(`https://${s3BucketName}.s3.amazonaws.com/`)) {
            return { success: true }
        };
        const key = url.replace(`https://${s3BucketName}.s3.amazonaws.com/`, '');
        await s3Client.send(new DeleteObjectCommand({
            Key: key,
            Bucket: s3BucketName
        }));
        return { success: true };
    } catch (error) {
        return { success: false, error };
    };
};

// utility fuction to get targeted video resolutions
const getTargetResolutions = (originalWidth: number, originalHeight: number): string[] => {
    const resolutionsToTranscode = [];
    if (originalWidth >= 1080 || originalHeight >= 1080) {
        resolutionsToTranscode.push('1080', '720', '480', '360');
    } else if (originalWidth >= 720 || originalHeight >= 720) {
        resolutionsToTranscode.push('720', '480', '360');
    } else if (originalWidth >= 480 || originalHeight >= 480) {
        resolutionsToTranscode.push('480', '360');
    } else if (originalWidth >= 360 || originalHeight >= 360) {
        resolutionsToTranscode.push('360');
    } else {
        resolutionsToTranscode.push('360');
    }
    return resolutionsToTranscode;
};


export {
    uploadToS3,
    deleteFromS3,
    getTargetResolutions,
};