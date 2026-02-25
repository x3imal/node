import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {usersRouter} from './routes/users';
import {booksRouter} from './routes/books';

/**
 * Creates and configures the Express application.
 * @returns Express app instance.
 */
export const createApp = () => {
  const app = express();

  /**
   * Logs every request with the original URL.
   */
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  /**
   * Allows requests only from localhost origins.
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }
        try {
          const {hostname} = new URL(origin);
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            callback(null, true);
            return;
          }
          callback(new Error('CORS blocked'));
        } catch (err) {
          callback(err as Error);
        }
      },
    })
  );
  app.use(express.json());

  app.use('/users', usersRouter);
  app.use('/books', booksRouter);

  /**
   * Fallback handler for unknown routes.
   */
  app.use((_req: Request, res: Response) => {
    res.status(404).json({error: 'Not found'});
  });

  /**
   * Global error handler.
   */
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({error: 'Internal server error', message});
  });

  return app;
};
