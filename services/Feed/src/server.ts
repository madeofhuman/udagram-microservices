import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './database/sequelize';
import { IndexRouter } from './controllers/v0/index.router';
import { V0_MODELS } from './controllers/v0/model.index';
import { config } from './config/config';
import { errorLogger, infoLogger } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/general.middleware';

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
      methods: 'GET,HEAD,OPTIONS,PATCH,POST',
      origin: config.cors_allowed_origin,
    })
  );
  app.use(bodyParser.json());
  app.use(infoLogger);
  app.use('/api/v0/', IndexRouter);
  app.get('/', async (req, res) => {
    return res.send('Feed Service.');
  });
  app.use(errorLogger);
  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Feed Service running on port:${port}`);
    console.log('press CTRL+C to stop server');
  });
})();
