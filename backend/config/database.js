// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_URL || process.env.DATABASE_URL;

const commonOptions = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    // Most hosted Postgres require SSL. If your provider doesn't, set `ssl: false`.
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

export const sequelize = connectionString
  ? // Use the full URI when provided (preferred)
    new Sequelize(connectionString, commonOptions)
  : // Fallback to individual env vars
    new Sequelize(
      process.env.DB_NAME || 'postgres',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        ...commonOptions
      }
    );

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    console.error(error);
    return false;
  }
};
