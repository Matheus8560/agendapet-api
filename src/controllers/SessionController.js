import Usuario from '../models/usuario';

import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Utils from '../Utils'
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

        if (!(await bcrypt.compare(campos.senha, usuario.senha))){
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

    async recovery(req, res) {
        const campos = req.body;
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
        });
        if (!(await schema.isValid(campos))){
            return res.status(401).json({ erro: 'E-mail informado não é válido.'} );
        };

        const usuario = await Usuario.findOne({email: campos.email});
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        };

        const novaSenha = Utils.geraSenha(6);
        const senhaHash = await bcrypt.hash(novaSenha, 12);

        if (await Usuario.findByIdAndUpdate( usuario._id,{ senha: senhaHash })) {
            const emailOptions = {
                from: "noreplay@agendapet.com",
                to: campos.email,
                subject: "Recuperação de senha Agenda Pet",
                text: `Sua nova senha é: ${novaSenha}`
            };
            
            await Utils.enviaEmail(emailOptions);

            return res.json({
                successo: `Uma nova senha foi enviada para seu email: ${campos.email}`
            });
        }

        return res.status(400).json({
            erro: "Erro ao tentar recuperar conta"
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