import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError.js';
import { createNewUser, getUserAndPasswordByEmail, getUserByEmail } from '../models/users.js';
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

export const verifyAuthToken = (token) => jsonwebtoken.verify(token, WEB_TOKEN_SECRET_KEY); 

const createPasswordHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync());

const compareHashWithPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

export const registerNewUser = async ({ firstName, lastName, email, password, role, dateOfBirth, profilePicture }) => {
    try {
        const possibleUser = await getUserByEmail(email);

        if (possibleUser) {
            // throw new NotUniqueEmailError();
            throw new Error(`NotUniqueEmailError`);
        }

        const passwordHash = createPasswordHash(password);
        const newUser = await createNewUser({ firstName, lastName, email, password: passwordHash, role, dateOfBirth, profilePicture });
        const token = generateAuthToken({ _id: newUser._id });

        return {
            token: token,
            role: newUser.role,
        };
    } catch (error) {
        console.error('Error in registerNewUser:', error);
        throw error;
    }
};

export const authenticateUser = async (email, password) => {
    try {
        // const user = await getUserByEmail(email);
        const user = await getUserAndPasswordByEmail(email);
    
        if (!user) {
            throw new AuthError();
        }
    
        const isPasswordCorrect = compareHashWithPassword(password, user.password);
        // const isPasswordCorrect = user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new AuthError();
        }
    
        const token = generateAuthToken({ _id: user._id });

        return {
            token: token,
            role: user.role,
        };
    } catch (error) {
        console.error('Error in authenticateUser:', error);
        throw error;
    }
};
