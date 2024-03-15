import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { deleteFromS3, getTargetResolutions, uploadToS3 } from '../utils/utils';
import { s3BucketName } from '../config/config';

interface VideoMetadata {
    streams?: { width?: number; height?: number }[];
};

const transcodeVideo = async (videoUrl: string) => {
    try {
        const metadata = await new Promise<VideoMetadata>((resolve, reject) => {
            ffmpeg.ffprobe(videoUrl, (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata);
                }
            });
        });

        if (!metadata || !metadata.streams || metadata.streams.length === 0) {
            return {
                success: false,
                message: 'No video streams found in the metadata.',
            };
        }

        const originalWidth = metadata.streams[0].width as number;
        const originalHeight = metadata.streams[0].height as number;

        const outputResolutions: string[] = [];
        const resolutionsToTranscode = getTargetResolutions(originalWidth, originalHeight);

        const conversionPromises = resolutionsToTranscode.map(async (lowerResolution) => {

            const urlPath = videoUrl.replace(`https://${s3BucketName}.s3.amazonaws.com/`, '')
            const prefixPath = path.dirname(urlPath);

            const outputFileName = `${lowerResolution}p.mp4`;
            const uploadKey = `${prefixPath}/${outputFileName}`;
            const outputPath = path.resolve(`./output/${outputFileName}`);

            outputResolutions.push(`https://${s3BucketName}.s3.amazonaws.com/${uploadKey}`);

            return new Promise((resolve, reject) => {
                ffmpeg(videoUrl)
                    .videoCodec('libx264')
                    .audioCodec('libmp3lame')
                    .size(`${lowerResolution}x?`)
                    .outputOptions([
                        '-movflags frag_keyframe+empty_moov',
                        '-preset fast',
                        '-pix_fmt yuv420p',
                    ])
                    .outputFormat('mp4')
                    .output(outputPath)
                    .on('end', async () => {
                        try {
                            const stream = fs.createReadStream(outputPath);
                            await uploadToS3(stream, uploadKey, 'video/mp4');
                            console.log(`Conversion to ${lowerResolution}p complete. Uploaded to S3.`);
                            await fs.promises.unlink(outputPath);
                            console.log(`Local file ${outputFileName} deleted.`);
                            resolve(null);
                        } catch (err) {
                            console.error('Error uploading transcoded video to S3:', err);
                            reject(err);
                        }
                    })
                    .on('error', (err) => {
                        console.error('Error converting video:', err);
                        reject(err);
                    })
                    .run();
            });
        });

        await Promise.all(conversionPromises);

        const { success } = await deleteFromS3(videoUrl);

        if (success) {
            console.log(`Original video file deleted from S3.`);
        }

        return {
            success: true,
            message: 'Video transcoded successfully.',
            resolutions: outputResolutions,
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Error while transcoding the video.',
            error: error.message,
        }
    }
};

export default transcodeVideo;