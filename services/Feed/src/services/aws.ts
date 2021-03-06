import AWS = require('aws-sdk');
import {config} from '../config/config';

if (config.aws_profile !== 'DEPLOYED') {
  const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
  AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: { Bucket: config.aws_media_bucket },
});

export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
