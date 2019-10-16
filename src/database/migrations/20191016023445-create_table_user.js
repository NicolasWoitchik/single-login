module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'Fisrt Name required.',
          },
          len: {
            args: [4, 20],
            msg: 'First Name length invalid',
          },
        },
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'Last Name required.',
          },
          len: {
            args: [4, 20],
            msg: 'Last Name length invalid',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: 'First Name required.',
          },
          isEmail: {
            msg: 'Email must be valid e-mail',
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }),
  down: queryInterface => queryInterface.dropTable('users'),
};
