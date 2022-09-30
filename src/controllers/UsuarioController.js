import Usuario from '../models/usuario';
import Agendamento from '../models/agendamento';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import Utils from '../Utils';

class UsuarioController {
    async index(req, res) {
        const filtro = req.query;      
        const response = await Usuario.find(filtro);
        return res.json(response.map((item) => ({ 
            _id: item._id,
            nome: item.nome,
            email: item.email,
            telefone: item.telefone,
            nivel: item.nivel
        })));
    }

    async create(req, res) {
        const campos = req.body;
        const senhaUsuario = Utils.geraSenha(6);
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            email: Yup.string().email().required(),
            telefone: Yup.string(),

        });
        if (!(await schema.isValid(campos))){
            return res.status(400).json({erro: 'Falha na validação. Verifique os dados.'});
        };

        const usuario = await Usuario.findOne({email: campos.email});
        if (usuario) {
            return res.status(400).json({erro: 'Email já está cadastrado no sistema.'});
        };

        const senhaHash = campos.senha ? await bcrypt.hash(campos.senha, 12) : await bcrypt.hash(senhaUsuario, 12);

        const novoUsuario = { 
            ...campos,
            senha: senhaHash 
        };

        if (!campos.senha) {
            const emailOptions = {
                from: "noreplay@agendapet.com",
                to: campos.email,
                subject: "Bem-vindo a Agenda Pet",
                text: `Sua senha de acesso é: ${senhaUsuario}`
            };
            
            await Utils.enviaEmail(emailOptions);
        }

        const response = await Usuario.create(novoUsuario);
        return res.json({
            _id: response._id,
            nome: response.nome,
            email: response.email,
            telefone: response.telefone,
            nivel: response.nivel,
        });
    }

    async update(req, res) {
        const campos = req.body;
        const { usuarioId } = req.params;
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            email: Yup.string().email().required(),
            telefone: Yup.string().required(),
            senha: Yup.string(),
            usuarioId: Yup.string().required(),

        });
        if (!(await schema.isValid({ ...campos, usuarioId }))){
            return res.status(400).json({erro: 'Falha na validação. Verifique os dados.'});
        };

        const usuario = await Usuario.findOne({ email: campos.email });
        if (usuario && usuario._id != usuarioId) {
            return res.status(400).json({erro: 'Email já está cadastrado no sistema.'});
        };

        if (campos.senha) {
            const senhaHash = await bcrypt.hash(campos.senha, 12);
            const response = await Usuario.findOneAndUpdate(
                { _id : usuarioId },
                {
                    nome: campos.nome,
                    email: campos.email,
                    telefone: campos.telefone,
                    senha: senhaHash,
                },
                { new: true }
            );
    
            return res.json({
                id: response.usuarioId,
                nome: response.nome,
                email: response.email,
                telefone: response.telefone,
            });
        } else {
            const response = await Usuario.findOneAndUpdate(
                { _id : usuarioId },
                {
                    nome: campos.nome,
                    email: campos.email,
                    telefone: campos.telefone,
                },
                { new: true }
            );
    
            return res.json({
                id: response.usuarioId,
                nome: response.nome,
                email: response.email,
                telefone: response.telefone,
            });
        }

    }

    async destroy(req, res) {
        const { usuarioId } = req.params;
        
        if (!usuarioId){
            return res.status(400).json({erro: 'Usuario não informado.'});
        };

        const agendamento = await Agendamento.find({ clienteId: usuarioId})
        if (agendamento.length>0) {
            try {
                await Agendamento.remove({clienteId: usuarioId})
            } catch (error) {
                console.log(error);    
            }
        
        }

        try {
            await Usuario.findByIdAndRemove(usuarioId);
            return res.status(200).json({msg: "Usuario excluído com sucesso"});
        } catch (error) {
            return res.status(400).json({
                erro: `Não foi possivel remover usuario.`
            });
        }
    }  
}

export default new UsuarioController();