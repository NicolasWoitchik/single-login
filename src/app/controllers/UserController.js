import * as yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const user = await User.findByPk(req.user.id);

    return res.json(user);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      first_name: yup.string().required(),
      last_name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      pass: yup
        .string()
        .required()
        .min(6),
    });

    try {
      const body = await schema.validate(req.body);
      const userExists = await User.findOne({
        where: { email: 'nicolas@woitchik.com.br' },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists!' });
      }

      const user = await User.create(body);
      const response = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };

      return res.json(response);
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      });
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      first_name: yup.string(),
      last_name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string().min(6),
      pass: yup
        .string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: yup
        .string()
        .when('pass', (password, field) =>
          password ? field.required().oneOf([yup.ref('pass')]) : field
        ),
    });

    try {
      const body = await schema.validate(req.body);

      const { email, oldPassword } = body;

      const user = await User.findByPk(req.user_id);

      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: 'User already exists!' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      const { id, first_name, last_name } = await user.update(req.body);

      return res.json({
        id,
        first_name,
        last_name,
        email,
      });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  }

  async destroy(req, res) {
    if (await User.destroy({ where: { email: req.body.email } })) {
      return res.status(200).json({ error: 'User deleted!' });
    }

    return res.send();
  }
}

export default new UserController();
/*
function removeSpecialCaracteres(field) {
  const specialChars = '!@#$^&%*()+=-[]/{}|:<>?,. ';

  for (let i = 0; i < specialChars.length; i++) {
    field = field.replace(new RegExp(`\\${specialChars[i]}`, 'gi'), '');
  }

  return field;
}

function cpfValidator(strCPF) {
  let sum;
  let re;
  sum = 0;
  if (strCPF === '00000000000') return false;

  for (let i = 1; i <= 9; i++)
    sum += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  re = (sum * 10) % 11;

  if (re === 10 || re === 11) re = 0;
  if (re !== parseInt(strCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  re = (sum * 10) % 11;

  if (re === 10 || re === 11) re = 0;
  if (re !== parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
*/
