import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { create, getUserByLogin } from "./users.js";
import { AuthError } from '../errors/auth-error.js';
// import { WEB_TOKEN_SECRET_KEY } from '../config/constants.js';
const WEB_TOKEN_SECRET_KEY = 'k41Mvn3hsi45';
const EXPIRES_IN = '1d';

const ADMIN = 200;
const USER = 100;
const LIMITED_USER = 50;

export const rolePermissions = {
    admin: ADMIN,
    user: USER,
    limited_user: LIMITED_USER,
};

const generateAuthToken = (payload) => jsonwebtoken.sign(payload, WEB_TOKEN_SECRET_KEY, { expiresIn: EXPIRES_IN });

const createPasswordHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync());

const compareHashWithPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

export const registerNewUser = async (username, password, role) => {
    const possibleUser = await getUserByLogin(username);

    if (possibleUser) {
        // throw new NotUniqueLoginError();
        throw new Error(`NotUniqueLoginError`);
    }

    const passwordHash = createPasswordHash(password);

    const newUser = await create({
        login: username,
        role: role || 'limited_user',
        passwordHash: passwordHash
    });

    return newUser;
};

export const authenticateUser = async (username, password) => {
    const user = await getUserByLogin(username);
  
    if (!user) {
        throw new AuthError();
    }
  
    const isPasswordCorrect = compareHashWithPassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
        throw new AuthError();
    }
  
    return generateAuthToken({
        id: user.id,
    });
};
