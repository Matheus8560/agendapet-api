import jwt from 'jsonwebtoken';
import {promisify} from 'util'
import 'dotenv/config';

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({error: 'Acesso negado!'});
    }
    
    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        return next();
    } catch {
        return res.status(401).json({error: 'Token invalido!'});
    }

}