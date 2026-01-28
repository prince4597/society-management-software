'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename existing column
    await queryInterface.renameColumn('residents', 'flat_ids', 'flat_ids_old');

    // 2. Add new column with correct type
    await queryInterface.addColumn('residents', 'flat_ids', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
      defaultValue: [],
      comment: 'Array of property IDs linked to this resident',
    });

    // 3. Move data from old column to new column
    // We need to handle the conversion from JSONB string array to Postgres UUID array
    await queryInterface.sequelize.query(`
      UPDATE residents 
      SET flat_ids = ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(flat_ids_old, '[]'::jsonb))::uuid
      )
      WHERE flat_ids_old IS NOT NULL 
      AND jsonb_typeof(flat_ids_old) = 'array'
      AND jsonb_array_length(flat_ids_old) > 0;
    `);

    // 4. Remove old column
    await queryInterface.removeColumn('residents', 'flat_ids_old');
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Rename current column
    await queryInterface.renameColumn('residents', 'flat_ids', 'flat_ids_new');

    // 2. Add back old column type
    await queryInterface.addColumn('residents', 'flat_ids', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    // 3. Move data back
    await queryInterface.sequelize.query(`
      UPDATE residents 
      SET flat_ids = to_jsonb(flat_ids_new)
      WHERE flat_ids_new IS NOT NULL;
    `);

    // 4. Remove new column
    await queryInterface.removeColumn('residents', 'flat_ids_new');
  },
};
