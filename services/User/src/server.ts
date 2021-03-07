import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config/config';
import { sequelize } from './database/sequelize';
import { infoLog, errorLog } from './controllers/v0/middlewares/log.middleware';
import { IndexRouter } from './controllers/v0/index.router';
import { V0_MODELS } from './controllers/v0/model.index';

(async () => {
  await sequelize.addModels(V0_MODELS);
  await sequelize.sync();
  const app = express();
  const port = config.port;
  app.use(
    cors({
      allowedHeaders: [
        'X-Access-Token',
        'Accept',
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'Origin',
      ],
      methods: 'GET,HEAD,OPTIONS,POST',
      origin: config.cors_allowed_origin,
    })
  );
  app.use(bodyParser.json());
  app.use(infoLog);
  app.use('/api/v0/', IndexRouter);
  app.get('/', async (req, res) => {
    return res.send('User Service.');
  });
  app.use(errorLog);
  app.listen(port, () => {
    console.log(`User Service running on port:${port}.`);
    console.log('press CTRL+C to stop server.');
  });
})();
