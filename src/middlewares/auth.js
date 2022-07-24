import jwt from 'jsonwebtoken';
import {promisify} from 'util'
import 'dotenv/config';

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({error: 'Token de acesso não encontrado!'});
    }
    
    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

        req.id = decoded.id
        req.email = decoded.email
        req.nivel = decoded.nivel

        return next();
    } catch {
        return res.status(401).json({error: 'Token invalido!'});
    }

}