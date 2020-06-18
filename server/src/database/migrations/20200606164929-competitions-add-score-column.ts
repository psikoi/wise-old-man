export = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('competitions', 'score', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('competitions', 'score');
  }
};