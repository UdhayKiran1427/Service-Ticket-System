import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            sucess: false,
            message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({field: "authMiddleware", message: error.message });
    }
};


export const requireAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            sucess: false,
            message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
    if (req.user && req.user.role === 'admin') {
        next();
    }else{
        return res.status(403).json({
            sucess: false,
            message: 'Acess denied: Admins only'
        });
    }
};

export const requireAdminTechnician = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            sucess: false,
            message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
    if (req.user && req.user.role === 'admin') {
        next();
    }else if(req.user && req.user.role === 'technician'){
        next();
    }else if(req.user && req.user.role === 'user'){
        next();
    }else{
        return res.status(403).json({
            sucess: false,
            message: 'Acess denied: Admins and Technicians only'
        });
    }
};
export const requireTechnician = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            sucess: false,
            message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
    if (req.user && req.user.role === 'technician') {
        next();
    }else{
        return res.status(403).json({
            sucess: false,
            message: 'Access denied: Technicians only'
        });
    }
};