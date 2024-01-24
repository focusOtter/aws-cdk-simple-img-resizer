import { Construct } from 'constructs'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { RemovalPolicy } from 'aws-cdk-lib'

export const createResizedImagesS3Bucket = (scope: Construct) => {
	return new Bucket(scope, 'ResizedImagesS3Bucket', {
		removalPolicy: RemovalPolicy.DESTROY,
	})
}
