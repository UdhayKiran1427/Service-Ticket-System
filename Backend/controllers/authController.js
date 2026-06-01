import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {
    const { username, email, password,role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role
        });
        res.status(201).json({ 
            sucess: true,
            message: 'User registered successfully',
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: genrateToken({ id: user._id,  role: user.role })
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                sucess: false,
                message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ 
                sucess: false,
                message: 'Invalid email or password' });
        }
        res.status(200).json({ 
            sucess: true,
            message: 'User logged in successfully',
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: genrateToken({id: user._id, role: user.role}), 
        });
    } catch (error) {
        res.status(500).json({
             sucess: false,  
             message: 'Error logging in user' });
    }
};

export const genrateToken = ({ id, role }) => {
    return jwt.sign({_id: id.toString(),role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}
