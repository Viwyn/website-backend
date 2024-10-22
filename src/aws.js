import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Upload } from '@aws-sdk/lib-storage'
import streamifier from 'streamifier'

import dotenv from 'dotenv'
dotenv.config()

const REGION = process.env.AWS_REGION
const BUCKET = process.env.AWS_BUCKET
const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

const client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
})

async function getUrl (key) {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
    return getSignedUrl(client, command, { expiresIn: 60 })
};

export async function getImageUrl(key) {
    try {
        const imgUrl = await getUrl(key)

        return (imgUrl)
    } catch (err) {
        console.log(err)
    }
}

export async function uploadFile(file, path = null) {
    try {
        const readStream = streamifier.createReadStream(file.buffer)
        const upload = new Upload({
			client: client,
			params: {
				Bucket: BUCKET,
				Key: path ? path + file.originalname : file.originalname,
				Body: readStream,
                ContentType: file.mimetype,
                ContentDisposition: 'inline; filename="' + file.name + '"',
			},
		});
        const result = await upload.done();
    } catch (err) {
        console.log(err)
        throw err
    }
}