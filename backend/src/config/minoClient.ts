import { Client } from 'minio';

export const minioClient = new Client({
    endPoint: process.env.ENDPOINT_MINIO as string,
    port: parseInt(process.env.PORT_MINIO as string),
    accessKey: process.env.ACCESS_KEY_MINIO as string,
    secretKey: process.env.SECRET_KEY_MINIO as string,
    useSSL: false,
});