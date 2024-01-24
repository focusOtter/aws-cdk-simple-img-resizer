import {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
	GetObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp = require('sharp')

// Create the S3 client
const s3Client = new S3Client({ region: process.env.REGION })

exports.handler = async (event: any) => {
	console.log('the event', event)

	const originalBucket = process.env.ORIGINAL_BUCKET_NAME as string
	const originalKey = process.env.ORIGINAL_IMAGE_KEY as string
	const resizedBucket = process.env.RESIZED_BUCKET_NAME as string

	// try to get the original image
	let res: GetObjectCommandOutput | undefined
	try {
		res = await s3Client.send(
			new GetObjectCommand({ Bucket: originalBucket, Key: originalKey })
		)
	} catch (e) {
		console.log('error getting original image', e)
	}

	//Prepare the retrieved img for Sharp manipulation
	if (!res?.Body) throw new Error('No body found in response')

	const imageByteArr = await res.Body.transformToByteArray()
	const imageBuffer = Buffer.from(imageByteArr)

	//do the sharp resizing
	const resizedImg = await sharp(imageBuffer)
		.resize({
			width: 200,
			height: 200,
			fit: 'contain',
		})
		.toBuffer()

	// upload resized img to S3 and return presignedURL to client

	const resizedImgKey = `resized-${originalKey}`
	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: resizedBucket,
				Key: resizedImgKey,
				Body: resizedImg,
				ContentType: 'image/png',
			})
		)

		const url = await getSignedUrl(
			s3Client,
			new GetObjectCommand({
				Bucket: resizedBucket,
				Key: resizedImgKey,
			}),
			{
				expiresIn: 3600, // URL expires in 1 hour
			}
		)

		console.log('the url that is signed', url)

		return {
			statusCode: 200,
			body: { url },
		}
	} catch (e) {
		console.log('uh oh', e)
		return {
			statusCode: 500,
		}
	}
}
