import { Construct } from 'constructs'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'

export const createOrignalImagesS3Bucket = (scope: Construct) => {
	return new Bucket(scope, 'OrignalImagesS3Bucket', {
		removalPolicy: RemovalPolicy.DESTROY,
		lifecycleRules: [
			{
				expiration: Duration.days(30), // delete original items after 30 days
			},
		],
	})
}
