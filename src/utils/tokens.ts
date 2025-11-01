import dotenv from 'dotenv';
import { IUser } from '../model/user.model';
import jwt from 'jsonwebtoken';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string

export const signAccessToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: user._id.toString(), 
            roles: user.roles
        }, 
        JWT_SECRET, 
        { 
            expiresIn: '1h' 
        }
    );
}  
