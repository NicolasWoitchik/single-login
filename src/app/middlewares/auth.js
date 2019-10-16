import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/User';

import Token from '../services/Token';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).json({
      message: 'Token error',
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      message: 'Token malformatted',
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_KEY);

    const isValid = await Token.verify(decoded.id);

    if (!isValid) {
      return res.status(401).json({ message: 'Token Invalid' });
    }

    if (token !== isValid) {
      return res.status(401).json({ message: 'Token Invalid' });
    }

    if (!(await User.findByPk(decoded.id))) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {};
    req.user.id = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid!' });
  }
};
