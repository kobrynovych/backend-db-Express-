import jsonwebtoken from 'jsonwebtoken';
import { getRoleByUserId } from '../../users/users.service.js';
import { NotAuthorizedError } from '../../errors/models/not-authorized-error.model.js';
import { rolePermissions } from '../authorization.service.js';
import { WEB_TOKEN_SECRET_KEY } from '../../../config.js';

export const hasRole = (requiredRole) => {
    const requiredRolePermission = rolePermissions[requiredRole] || 0;

    return async (req, res, next) => {
        try {
            const { token } = req.body;
            const decoded = jsonwebtoken.verify(token, WEB_TOKEN_SECRET_KEY);
            const userRole = await getRoleByUserId(decoded.id);
            const userPermissionLevel = rolePermissions[userRole] || 0;

            if (userPermissionLevel < requiredRolePermission) {
                throw new NotAuthorizedError();
            }

            return next();
        } catch (error) {
            next(error);
        }
    }
};