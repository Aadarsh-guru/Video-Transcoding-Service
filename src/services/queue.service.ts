import { Queue, Worker } from 'bullmq';
import { connection, queueName } from '../config/config';
import transcodeVideo from './transcode.service';

const queue = new Queue(queueName, { connection });

const worker = new Worker(queueName, async (job) => {
    try {
        const { videoUrl, onSuccessEndpoint } = job.data;
        const { success, message, resolutions } = await transcodeVideo(videoUrl);
        if (success) {
            await fetch(onSuccessEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    resolutions,
                })
            });
        }
    } catch (error) {
        console.log(error);
    }
}, {
    connection,
    concurrency: Number(process.env.VIDEO_TRANSCODING_CONCURRENCY) || 1,
    limiter: {
        max: 1, // Maximum number of retries
        duration: 1000, // Delay between retries in milliseconds
    },
});

process.on('SIGTERM', () => {
    worker.close().then(() => {
        process.exit(0);
    });
});

export default queue;