import { Redis } from 'ioredis';
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_BUCKET_REGION as string,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

const s3BucketName = process.env.S3_BUCKET_NAME as string;

const queueConnection = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null
});
const workerConnection = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null
});

const queueName = process.env.QUEUE_NAME as string;

export {
    s3Client,
    s3BucketName,
    queueName,
    queueConnection,
    workerConnection,
};