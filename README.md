# AWS CDK Simple Image Resizer

## Overview

This repository contains an AWS Cloud Development Kit (CDK) project written in TypeScript, designed to demonstrate a simple image resizing solution on AWS. The solution involves deploying a stack that contains two Amazon S3 buckets and an AWS Lambda function.

- **S3 Bucket 1**: Holds original-sized images.
- **S3 Bucket 2**: Stores the resized images.
- **Lambda Function**: Handles the resizing process using the Sharp npm library.

## Prerequisites

Before deploying this application, ensure you have the following:

- AWS CLI installed and configured.
- Node.js and npm installed.
- AWS CDK installed (`npm install -g aws-cdk`).
- An existing Sharp layer in your AWS account. If you don't have it, follow the instructions in the "Sharp Layer Deployment" section.

## Sharp Layer Deployment

If you do not have a Sharp layer deployed in your AWS account, you can deploy it using the following steps:

1. Visit the [AWS Sharp Layer Repository](https://github.com/Umkus/lambda-layer-sharp).
2. In the README, click on the "releases" link and download the latest `sharp` zip file to your computer.
3. Open your terminal and execute the following command to deploy the Sharp package to AWS Lambda:

   ```sh
   aws lambda publish-layer-version \
       --layer-name sharp \
       --description "Sharp layer" \
       --license-info "Apache License 2.0" \
       --zip-file fileb://dist/sharp-layer.zip \
       --compatible-runtimes nodejs14.x nodejs16.x nodejs18.x \
       --compatible-architectures x86_64 arm64
   ```

## Deployment

To deploy the AWS CDK Simple Image Resizer application:

1. Clone this repository to your local machine.
2. Navigate to the repository directory.
3. Run `npm install` to install the necessary dependencies.
4. Execute `npx aws-cdk deploy` to deploy the application stack to your AWS account.

## Usage

After deployment, upload an image to the first S3 bucket. The Lambda function will automatically resize the image and place the resized version in the second S3 bucket.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with your changes.
