import { Duration } from 'aws-cdk-lib'
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

type CreateResizeImageFuncProps = {
	appName: string
	originalBucketName: string
	originalImgKey: string
	resizedBucketName: string
	sharpLayerArn: string
	region: string
}
export const createResizeImageFunc = (
	scope: Construct,
	props: CreateResizeImageFuncProps
) => {
	const sharpLayer = LayerVersion.fromLayerVersionArn(
		scope,
		`${props.appName}-sharpLayer`,
		props.sharpLayerArn
	)

	const resizeImageFunc = new NodejsFunction(
		scope,
		`${props.appName}-resizeImageFunc`,
		{
			functionName: `${props.appName}-resizeImageFunc`,
			runtime: Runtime.NODEJS_18_X,
			timeout: Duration.seconds(10),
			memorySize: 256,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			layers: [sharpLayer],
			environment: {
				ORIGINAL_BUCKET_NAME: props.originalBucketName,
				ORIGINAL_IMAGE_KEY: props.originalImgKey,
				RESIZED_BUCKET_NAME: props.resizedBucketName,
				REGION: props.region,
			},
			bundling: {
				externalModules: ['sharp'],
			},
		}
	)

	return resizeImageFunc
}
