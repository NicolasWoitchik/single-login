import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        first_name: {
          type: Sequelize.STRING,
          allowNull: true,
          default: '',
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: true,
          default: '',
          validate: {
            notEmpty: {
              msg: 'Last Name required.',
            },
            len: {
              args: [4, 20],
              msg: 'First Name length invalid',
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
          default: '',
          validate: {
            isEmail: {
              msg: 'Email must be valid e-mail',
            },
          },
        },
        pass: Sequelize.VIRTUAL,
        password: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        paranoid: true,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.pass) {
        user.password = await bcrypt.hash(user.pass, 8);
      }
    });

    return this;
  }

  checkPassword(pass) {
    return bcrypt.compare(pass, this.password);
  }
}

export default User;
