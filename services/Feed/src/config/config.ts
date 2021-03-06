import { Dialect } from 'sequelize/types';

const dialect: Dialect = 'postgres';

export const config = {
  port: process.env.PORT || 8080,
  cors_allowed_origin: process.env.CORS_ORIGIN,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  dialect: dialect,
  aws_region: process.env.AWS_REGION,
  aws_profile: process.env.AWS_PROFILE,
  aws_media_bucket: process.env.AWS_BUCKET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  user_service_host: process.env.USER_SERVICE_HOST,
  image_filter_service_host: process.env.IMAGE_FITLER_SERVICE_HOST,
  feed_client_id: process.env.RESTAPI_FEED_CLIENT_ID,
  feed_private_key: process.env.RESTAPI_FEED_PRIVATE_KEY,
};
