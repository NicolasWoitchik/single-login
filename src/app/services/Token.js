import jwt from 'jsonwebtoken';
import redisConnector from 'ioredis';

import redisConfig from '../../config/redis';

class Token {
  constructor() {
    this.redis = new redisConnector({
      port: redisConfig.port,
      host: redisConfig.host,
      keyPrefix: 'token:',
    });

    this.tokenExpires = 60 * 60 * 24;

    this.generate = this.generate.bind(this);
  }

  async generate({ id }) {
    const token = jwt.sign(
      {
        id,
      },
      process.env.APP_KEY,
      {
        expiresIn: this.tokenExpires,
      }
    );

    await this.redis.set(id, JSON.stringify(token));

    return token;
  }

  async verify(id) {
    const item = await this.redis.get(id.toString());
    return item ? JSON.parse(item) : null;
  }
}

export default new Token();
