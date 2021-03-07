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
};
