import { Construct } from 'constructs'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { RemovalPolicy } from 'aws-cdk-lib'

export const createOrignalImagesS3Bucket = (scope: Construct) => {
	return new Bucket(scope, 'OrignalImagesS3Bucket', {
		removalPolicy: RemovalPolicy.DESTROY,
	})
}
