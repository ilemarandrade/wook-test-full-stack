import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './config/envSchema';
import V1Router from './v1/routes';
import { runInitialUsersSeed } from './modules/users/initialUsersSeed';
import { errorHandler } from './midlewares/errorHandler';

async function bootstrap(): Promise<void> {
  dotenv.config();
  validateEnv();

  const app = express();
  const PORT = process.env.PORT || 8081;

  // verify connection configuration
  // transporter.verify(function (error) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Server is ready to take our messages');
  //   }
  // });

  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // *** call to version 1 routes ***
  app.use('/api/v1', V1Router);
  app.use(errorHandler);

  await runInitialUsersSeed();

  app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting application', error);
  process.exit(1);
});
