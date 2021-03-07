import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './database/sequelize';
import { IndexRouter } from './controllers/v0/index.router';
import { V0_MODELS } from './controllers/v0/model.index';
import { config } from './config/config';
import { infoLog, errorLog } from './middlewares/log.middleware';

(async () => {
  await sequelize.addModels(V0_MODELS);
  await sequelize.sync();
  const app = express();
  const port = config.port;
  app.use(
    cors({
      allowedHeaders: [
        'X-Access-Token',
        'X-Requested-With',
        'Accept',
        'Content-Type',
        'Authorization',
        'Origin',
      ],
      methods: 'GET,HEAD,OPTIONS,PATCH,POST',
      origin: config.cors_allowed_origin,
    })
  );
  app.use(bodyParser.json());
  app.use(infoLog);
  app.use('/api/v0/', IndexRouter);
  app.get('/', async (req, res) => {
    return res.send('Feed Service.');
  });
  app.use(errorLog);
  app.listen(port, () => {
    console.log(`Feed Service running on port:${port}`);
    console.log('Press CTRL+C to stop server');
  });
})();
