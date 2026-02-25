import 'dotenv/config';
import mongoose from 'mongoose';
import {createApp} from './app';

const host = '127.0.0.1';
const port = Number(process.env.PORT) || 3005;
const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb://root:example@127.0.0.1:27017/library?authSource=admin';

/**
 * Connects to MongoDB and starts the HTTP server.
 * @returns Promise<void>
 */
const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    const app = createApp();
    app.listen(port, host, () => {
      console.log(`Server is running at http://${host}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
