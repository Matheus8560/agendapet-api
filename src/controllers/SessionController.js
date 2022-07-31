import Usuario from '../models/usuario';

import * as Yup from 'yup';
import bcryt from 'bcrypt';
import jwt from 'jsonwebtoken';
class SessionController {

    async create(req, res) {
        const campos = req.body;
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            senha: Yup.string().required(),
        });
        if (!(await schema.isValid(campos))){
            return res.status(401).json({ erro: 'Falha na validação.'} );
        };

        const usuario = await Usuario.findOne({email: campos.email});
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        };

        if (!(await bcryt.compare(campos.senha, usuario.senha))){
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        const user = {
            _id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            nivel: usuario.nivel, 
        }

        return res.json({
            ... user,
            token: jwt.sign({
                id: user._id,
                email: user.email,
                nivel: user.nivel,
            }, process.env.SECRET, {
                expiresIn: '7d',
            }),
        });
    }

    async refresh(req, res) {
        const uid = req.id

        const usuario = await Usuario.findOne({_id: uid});
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        };

        return res.json({
            token: jwt.sign({
                id: usuario._id,
                email: usuario.email,
                nivel: usuario.nivel,
            }, process.env.SECRET, {
                expiresIn: '7d',
            }),
        });
    }
    
}

export default new SessionController();