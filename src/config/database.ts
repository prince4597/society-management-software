import { Sequelize, Options } from 'sequelize';
import { env } from './environment';
import { logger } from '../utils/logger';

const getConnectionConfig = (): Options => {
  const baseConfig: Options = {
    dialect: 'postgres',
    logging: env.DB_LOGGING
      ? (msg: string): void => {
          logger.debug(msg);
        }
      : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  };

  if (env.DATABASE_URL) {
    return {
      ...baseConfig,
      dialectOptions:
        env.NODE_ENV === 'production'
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    };
  }

  return {
    ...baseConfig,
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.NODE_ENV === 'test' ? `${env.DATABASE_NAME}_test` : env.DATABASE_NAME,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    dialectOptions:
      env.NODE_ENV === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  };
};

export const sequelize = env.DATABASE_URL
  ? new Sequelize(env.DATABASE_URL, getConnectionConfig())
  : new Sequelize(getConnectionConfig());

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error closing database:', error);
    throw error;
  }
};
