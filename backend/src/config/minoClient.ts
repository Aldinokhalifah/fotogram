import { Client } from 'minio';

const endpoint_minio = process.env.ENDPOINT_MINIO as string;
if(!endpoint_minio) throw new Error("ENDPOINT_MINIO environment variable is required");

const port_minio = parseInt(process.env.PORT_MINIO as string);
if(!port_minio) throw new Error("PORT_MINIO environment variable is required");

const access_key_minio = process.env.ACCESS_KEY_MINIO as string;
if(!access_key_minio) throw new Error("ACCESS_KEY_MINIO environment variable is required");

const secret_key_minio = process.env.SECRET_KEY_MINIO as string;
if(!secret_key_minio) throw new Error("SECRET_KEY_MINIO environment variable is required");

export const minioClient = new Client({
    endPoint: endpoint_minio,
    port: port_minio,
    accessKey: access_key_minio,
    secretKey: secret_key_minio,
    useSSL: false,
});