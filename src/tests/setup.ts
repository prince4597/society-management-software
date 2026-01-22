import { sequelize } from '../config/database';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Test database setup failed: ${errorMsg}\n`);
    process.exit(1);
  }
});
