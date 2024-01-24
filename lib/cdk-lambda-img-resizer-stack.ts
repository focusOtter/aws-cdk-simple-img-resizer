import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createOrignalImagesS3Bucket } from './storage/originalBucket'
import { createResizedImagesS3Bucket } from './storage/resizedBucket'
import { createResizeImageFunc } from './functions/resizeImage/construct'

export class CdkLambdaImgResizerStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		//* Setup a few variables ahead of time
		const appName = 'serverless-img-resizer'
		const sharpLayerArn = `arn:aws:lambda:${this.region}:${this.account}:layer:sharp:1`
		const originalImgKey = 'original-img.png'

		//* Create the needed AWS services
		// create the bucket to hold the original img
		const originalImagesBucket = createOrignalImagesS3Bucket(this)

		// create the bucket to hold the resized img
		const resizedImagesBucket = createResizedImagesS3Bucket(this)

		// create the lambda function to resize the img
		const resizeImgFunc = createResizeImageFunc(this, {
			appName,
			sharpLayerArn,
			originalImgKey,
			region: this.region,
			originalBucketName: originalImagesBucket.bucketName,
			resizedBucketName: resizedImagesBucket.bucketName,
		})

		//* Grant the various permissions
		originalImagesBucket.grantRead(resizeImgFunc)
		resizedImagesBucket.grantReadWrite(resizeImgFunc)
	}
}
