import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_BUCKET_REGION as string,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

const s3BucketName = process.env.S3_BUCKET_NAME as string;

const connection = {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT as string),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
};

const queueName = process.env.QUEUE_NAME as string;

export {
    s3Client,
    s3BucketName,
    connection,
    queueName,
};