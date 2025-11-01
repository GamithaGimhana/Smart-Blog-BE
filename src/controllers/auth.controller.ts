import {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../model/user.model'
import { signAccessToken } from '../utils/tokens'

// /api/v1/auth/register
export const register = async(req: Request, res: Response) => {
    // res.status(201).json({ message: 'User registered successfully' })

    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.roles;
        const approved = req.body.approved;

        if (!firstname || !lastname || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required."
            });
        } 

        if ( role !== 'AUTHOR' && role !== 'USER' ) {
            return res.status(400).json({
                message: "Invalid role specified."
            });
        }

        const exUser = await User.findOne({ email: email })
        if (exUser) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            roles: [role],
            approved: approved
        })

        const savedUser = await newUser.save(); 

        console.log("User Data : ", { firstname, lastname, email, password, role, approved });

        res.status(201).json({
            message: 
                role === 'AUTHOR' ? 'Author registered successfully' :
                'User registered successfully',
            data: { 
                id: savedUser._id,
                email: savedUser.email,
                roles: savedUser.roles,
                approved: savedUser.approved
            }
        })
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({
             message: "Error while saving user"
        });
        return; 
    }
}

// /api/v1/auth/login
export const login = async (req: Request, res: Response) => {
    // res.status(200).json({ message: 'User logged in successfully' })

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }
        const valid = await bcrypt.compare(password, existingUser.password);
        if (!valid) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }   

        // generate JWT token
        const accessToken = signAccessToken(existingUser);
        
        res.status(200).json({
            message: "Login successful",
            data: { 
                email: existingUser.email,
                roles: existingUser.roles,
                accessToken
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
             message: "Error during login"
        });
        return; 
    }   
}

// /api/v1/auth/me
export const getMe = (req: Request, res: Response) => {
    res.status(200).json({ message: 'User information retrieved successfully' })
}

// /api/v1/auth/admin/register
export const registerAdmin = (req: Request, res: Response) => {
    res.status(201).json({ message: 'Admin registered successfully' })
}
