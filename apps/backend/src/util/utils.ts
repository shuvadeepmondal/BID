import jwt from 'jsonwebtoken';
import config from '../config/config';

export const createToken = (_id: string) => {
  //@ts-ignore
  return jwt.sign({ _id: _id }, config.JWT_SECRET, {
    expiresIn: config.JWT_COOKIE_EXPIRES_IN,
  });
};
