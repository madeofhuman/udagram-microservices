import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config/config';
import { sequelize } from './database/sequelize';
import { IndexRouter } from './controllers/v0/index.router';
import { V0_MODELS } from './controllers/v0/model.index';
import { errorLogger, infoLogger } from './controllers/v0/middlewares/logger.middleware';

(async () => {
  await sequelize.addModels(V0_MODELS);
  await sequelize.sync();
  const app = express();
  const port = config.port;
  app.use(
    cors({
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
      ],
      methods: 'GET,HEAD,OPTIONS,POST',
      origin: config.cors_allowed_origin,
    })
  );
  app.use(bodyParser.json());
  app.use(infoLogger);
  app.use('/api/v0/', IndexRouter);
  app.get('/', async (req, res) => {
    return res.send('User Service.');
  });
  app.use(errorLogger);
  app.listen(port, () => {
    console.log(`User Service running on port:${port}.`);
    console.log('press CTRL+C to stop server.');
  });
})();
