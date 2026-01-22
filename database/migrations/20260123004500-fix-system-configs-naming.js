'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns from camelCase to snake_case if they exist
    const tableInfo = await queryInterface.describeTable('system_configs');
    
    if (tableInfo.isPublic && !tableInfo.is_public) {
      await queryInterface.renameColumn('system_configs', 'isPublic', 'is_public');
    }
    if (tableInfo.createdAt && !tableInfo.created_at) {
      await queryInterface.renameColumn('system_configs', 'createdAt', 'created_at');
    }
    if (tableInfo.updatedAt && !tableInfo.updated_at) {
      await queryInterface.renameColumn('system_configs', 'updatedAt', 'updated_at');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('system_configs');
    
    if (tableInfo.is_public && !tableInfo.isPublic) {
      await queryInterface.renameColumn('system_configs', 'is_public', 'isPublic');
    }
    if (tableInfo.created_at && !tableInfo.createdAt) {
      await queryInterface.renameColumn('system_configs', 'created_at', 'createdAt');
    }
    if (tableInfo.updated_at && !tableInfo.updatedAt) {
      await queryInterface.renameColumn('system_configs', 'updated_at', 'updatedAt');
    }
  },
};
