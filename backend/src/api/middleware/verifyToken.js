import { verify } from 'jsonwebtoken';

export default function(req,res,next){
    const token = req.header('auth-token');
    if (!token) return res.status(400).send('Access Denied');

    try {
        const verified = verify(token, process.env.jwtSecret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}