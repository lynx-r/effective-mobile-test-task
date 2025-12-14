import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

export const isPasswordMatch = async (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};

export const generateFakeJwt = async (): Promise<string> => {
  const fakeUser = {
    userId: 1,
    scopes: ['admin']
  };
  return jwt.sign(fakeUser, config.jwt.secret, { expiresIn: '1h' });
};
