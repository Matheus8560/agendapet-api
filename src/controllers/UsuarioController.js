import Usuario from '../models/usuario';
import * as Yup from 'yup';

class UsuarioController {

    static geraSenha(tamanho){
        let i = 0;
        let ma = 'ABCDEFGHIJKLMNOPQRSTUVYXWZ';
        let mi = 'abcdefghijklmnopqrstuvyxwz';
        let nu = '0123456789';
        let senha = '';

        do {
            senha += ma.charAt(Math.floor(Math.random() * ma.length));
            i += 1;
            senha += mi.charAt(Math.floor(Math.random() * mi.length));
            i += 1;
            senha += nu.charAt(Math.floor(Math.random() * nu.length));
            i += 1;
        } while (i < tamanho);
        return senha;
    }

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
        const senhaUsuario = UsuarioController.geraSenha(6);
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            email: Yup.string().email().required(),
            telefone: Yup.string(),

        });
        if (!(await schema.isValid(campos))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        const usuario = await Usuario.findOne({email: campos.email});
        if (usuario) {
            return res.status(400).json({erro: 'Email já está cadastrado no sistema.'});
        };

        const novoUsuario = { ...campos, senha: senhaUsuario }

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
            telefone: Yup.string(),
            usuarioId: Yup.string().required(),

        });
        if (!(await schema.isValid({ ...campos, usuarioId }))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        const usuario = await Usuario.findOne({ email: campos.email });
        if (usuario && usuario._id != usuarioId) {
            return res.status(400).json({erro: 'Email já está cadastrado no sistema.'});
        };

        const response = await Usuario.findOneAndUpdate(
            { _id : usuarioId },
            campos,
            { new: true }
        );

        return res.json({
            id: response.usuarioId,
            nome: response.nome,
            email: response.email,
            telefone: response.telefone,
        });
    }

    async destroy(req, res) {
        const { usuarioId } = req.params;
        
        if (!usuarioId){
            return res.status(400).json({erro: 'Usuario não informado.'});
        };

        try {
            await Usuario.findByIdAndRemove(usuarioId);
            return res.status(200).json({msg: "Usuario excluído com sucesso"});
        } catch (error) {
            return res.status(400).json({
                erro: `Não foi possivel remover usuario. ${error}`
            });
        }
    }  
}

export default new UsuarioController();