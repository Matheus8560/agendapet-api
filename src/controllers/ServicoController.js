import Servico from '../models/servico';
import * as Yup from 'yup';

class ServicoController {

    async index(req, res) {
        let filtro;        
        const response = await Servico.find({ filtro });
        return res.json(response);
    }

    async create(req, res) {
        const campos = req.body;
        const schema = Yup.object().shape({
            titulo: Yup.string().required(),
            descricao: Yup.string(),
            valor: Yup.number().required(),
            duracao: Yup.number().required()
        });
        if (!(await schema.isValid(campos))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        const response = await Servico.create(campos);
        return res.json(response);
    }

    async update(req, res) {
        const campos = req.body;
        const { servicoId } = req.params;
        const schema = Yup.object().shape({
            titulo: Yup.string().required(),
            descricao: Yup.string().required(),
            valor: Yup.string(),
            duracao: Yup.string().required(),
            servicoId: Yup.string().required(),
        });
        if (!(await schema.isValid({ ...campos, servicoId }))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        const response = await Servico.findOneAndUpdate(
            { _id : servicoId },
            campos,
            { new: true }
        );

        return res.json(response);
    }

    async destroy(req, res) {
        const { servicoId } = req.params;
        
        if (!servicoId){
            return res.status(400).json({erro: 'Serviço não informado.'});
        };

        try {
            await Servico.findByIdAndRemove(servicoId);
            return res.status(200).json({msg: "Serviço excluído com sucesso"});
        } catch (error) {
            return res.status(400).json({
                erro: `Não foi possivel remover serviço. ${error}`
            });
        }
    }  
}

export default new ServicoController();