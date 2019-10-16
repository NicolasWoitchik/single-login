import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import User from '../models/User';
import Token from '../services/Token';

class AuthController {
  async store(req, res) {
    const schema = yup.object({
      email: yup
        .string()
        .email()
        .required(),
      password: yup.string().required(),
    });

    try {
      const body = await schema.validate(req.body);
      const { email, password } = body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match!' });
      }

      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: await Token.generate(user),
      });
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      });
    }
  }

  async forgotPassword(req, res) {
    const schema = yup.object({
      email: yup.string().email(),
    });

    try {
      const body = await schema.validate(req.body);
      const { email } = body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          error: 'User Not Found',
        });
      }

      return res.json({
        ok: true,
      });
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      });
    }
  }
}

export default new AuthController();
