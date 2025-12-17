import config from 'building-blocks/config/config';
import { httpContextMiddleware } from 'building-blocks/context/context';
import { errorHandler } from 'building-blocks/error-handler/error-handler';
import { Logger } from 'building-blocks/logging/logger';
import { morganMiddleware } from 'building-blocks/logging/morgan';
import { OpenTelemetry } from 'building-blocks/open-telemetry/open-telemetry';
import { initialSwagger } from 'building-blocks/swagger/swagger';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { collectDefaultMetrics } from 'prom-client';
import 'reflect-metadata';
import { postgresOptions } from './data/data-source';
import { initialDbContext } from './data/db.context';
import { initialLogger } from './extensions/logger.extensions';
import { registerMediatrHandlers } from './extensions/mediatr.extensions';
import { initialOpenTelemetry } from './extensions/otel.extensions';
import { initialRabbitmq } from './extensions/rabbitmq.extensions';
import { RegisterRoutes } from './routes/routes';

const startupApp = async () => {
  const logger = await initialLogger();

  OpenTelemetry.start();

  collectDefaultMetrics();

  const app = express();

  app.get('/', function (req, res) {
    res.send(config.serviceName);
  });

  app.use(httpContextMiddleware);

  app.use(morganMiddleware);

  await initialDbContext(postgresOptions);

  app.use(helmet());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(compression());

  app.use(cors());
  app.options('*', cors());

  await initialOpenTelemetry(app);

  RegisterRoutes(app);

  app.use(errorHandler);

  const server = app.listen(config.port, () => {
    logger.info(`Listening to http://localhost:${config.port}`);
  });

  await initialRabbitmq();

  registerMediatrHandlers();

  if (config.env == 'development') {
    await initialSwagger(app);
  }

  process.on('SIGINT', async () => {
    server.close();
    Logger.info('Application shutdown gracefully.');
  });
};

startupApp();
