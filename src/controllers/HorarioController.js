import Horario from '../models/horario';
import Utils from '../Utils';
import moment from 'moment';
import * as Yup from 'yup';

class HorarioController {
    async index(req, res) {
        const filtro = req.query;
        const response = await Horario.find(filtro).sort('dia');

        return res.json(response.map((item) => ({ 
            _id: item._id,
            dia: item.dia,
            inicio: item.inicio,
            fim: item.fim,
            horaInicio: Utils.coverteHora(item.inicio),
            horaFim: Utils.coverteHora(item.fim)
        })));
    }

    async create(req, res) {
        const campos = req.body;
        const schema = Yup.object().shape({
            dia: Yup.number().moreThan(-1).lessThan(7).required(),
            inicio: Yup.number().moreThan(-1).lessThan(49).required(),
            fim: Yup.number().moreThan(-1).lessThan(49).required()
        });
        if (!(await schema.isValid(campos))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        //verifica se a hora de início é maior ou igual a hora de fim do periodo de agendamentos
        if (campos.inicio >= campos.fim) {
            return res.status(400).json({erro: 'Horaio do fim do periodo de agendamentos não pode ser anterior ou igual ao de início.'});
        }

        //verifica se o dia já foi cadastrado no sistema
        const diaExiste = await Horario.find({dia: campos.dia})
        if (diaExiste.length) {
            return res.status(400).json({erro: 'Dia já está cadastrado no sistema.'});
        }

        const response = await Horario.create(campos);
        return res.json({ 
            _id: response._id,
            dia: response.dia,
            inicio: response.inicio,
            fim: response.fim,
            horaInicio: Utils.coverteHora(response.inicio),
            horaFim: Utils.coverteHora(response.fim)
        });
    }

    async update(req, res) {
        const campos = req.body;
        const { horarioId } = req.params;
        const schema = Yup.object().shape({
            dia: Yup.number().moreThan(-1).lessThan(7).required(),
            inicio: Yup.number().moreThan(-1).lessThan(49).required(),
            fim: Yup.number().moreThan(-1).lessThan(49).required()
        });
        if (!(await schema.isValid({ ...campos, horarioId }))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        //verifica se a hora de início é maior ou igual a hora de fim do periodo de agendamentos
        if (campos.inicio >= campos.fim) {
            return res.status(400).json({erro: 'Horáio do fim do periodo de agendamentos não pode ser anterior ou igual ao de início.'});
        }

        const response = await Horario.findOneAndUpdate(
            { _id : horarioId },
            campos,
            { new: true }
        );
        return res.json({ 
            _id: response._id,
            dia: response.dia,
            inicio: response.inicio,
            fim: response.fim,
            horaInicio: Utils.coverteHora(response.inicio),
            horaFim: Utils.coverteHora(response.fim)
        });
    }

    async destroy(req, res) {
        const { horarioId } = req.params;
        
        if (!horarioId){
            return res.status(400).json({erro: 'Horário não informado.'});
        };

        try {
            await Horario.findByIdAndRemove(horarioId);
            return res.status(200).json({msg: "Horário excluído com sucesso"});
        } catch (error) {
            return res.status(400).json({
                erro: `Não foi possivel remover horário. ${error}`
            });
        };
    }  
}

export default new HorarioController();