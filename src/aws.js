import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from 'dotenv'
dotenv.config()

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
};

export async function getImage(key) {
    const REGION = process.env.AWS_REGION;
    const BUCKET = process.env.AWS_BUCKET;
    const KEY = key;

    try {
        const clientUrl = await createPresignedUrlWithClient({
            region: REGION,
            bucket: BUCKET,
            key: KEY,
        });

        return (clientUrl)
    } catch (err) {
        console.log(err)
    }
}