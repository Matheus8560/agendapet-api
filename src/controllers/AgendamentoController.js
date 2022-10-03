import Agendamento from '../models/agendamento';
import Horario from '../models/horario';
import Servico from '../models/servico';
import Usuario from '../models/usuario';
import Utils from '../Utils';
import moment from 'moment';
import * as Yup from 'yup';

class AgendamentoController {
    async index(req, res) {
        const filtro = req.query;
        const response = await Agendamento.find({ data: { $gte: new Date(moment().format('YYYY-MM-DD')) }, ... filtro}).sort({ data: 1, hora: 1 }).populate(['servicoId', 'clienteId']);

        return res.json(response);
    }

    async available(req, res) {
        const filtro = req.query;
        const espacos = filtro.espacos ? filtro.espacos : 1;
        const dias = await Horario.find(filtro).sort('dia');
        const agendamentos = await Agendamento.find({ data: { $gte: new Date(moment().format('YYYY-MM-DD')) } });
        let agenda = [];

        //Procura nas proximas 4 semanas por horários para agendamento
        for (let i = 0; i < 4; i++) {
            dias.forEach(item => {
                if (item.ativo) {                    
                    let horas = [];
                    let diaDisponivel = moment().day(item.dia).add((7*i),'days');
                    let inicio = item.inicio;
                    let fim = item.fim;
                    if (moment(diaDisponivel).isAfter(moment())) {
                        do {
                            horas.push(inicio);
                            inicio++;
                        } while (inicio < fim);
        
                        const marcados = agendamentos.filter(item => moment(item.data).isSame(new Date(diaDisponivel), 'day'));
                        marcados.forEach(element => {
                            horas = horas.filter(val => !element.hora.includes(val))
                        });
                        // console.log(agendamentos);
        
                        if (espacos > 1) {
                            horas = horas.map((value, index, elements) => {
                                if(elements[index+1] == value+1) {
                                    return value
                                } 
                            })
                        }
                        
                        let dia = {
                            dia: moment(diaDisponivel),
                            horarios: horas.filter(item=>item != null),
                        }
                        
                        if (dia.horarios.length > 0 ) {
                            agenda.push(dia);
                        }
                    }
                }
            });
        }

        return res.json(agenda);
    }

    async create(req, res) {
        const campos = req.body;
        const schema = Yup.object().shape({
            servicoId: Yup.string().required(),
            clienteId: Yup.string().required(),
            data: Yup.date().required(),
            hora: Yup.array(),
            valor: Yup.number().required()
        });
        if (!(await schema.isValid(campos))){
            return res.status(400).json({erro: 'Falha na validação.'});
        };

        const servicoExiste = await Servico.findById({_id: campos.servicoId});
        if (!servicoExiste) {
            return res.status(400).json({erro: 'O serviço informado não foi encontrado.'});
        }

        const usuarioExiste = await Usuario.findById({_id: campos.clienteId});
        if (!usuarioExiste) {
            return res.status(400).json({erro: 'O usuário informado não foi encontrado.'});
        }

        const agendamentoExiste = await Agendamento.find({ data: new Date(campos.data), hora: { $in: [campos.hora] } })
        if (agendamentoExiste.length>0) {
            return res.status(400).json({erro: 'Este horário acabou de ser preenchido. Tente outro.'});
        }

        const response = await Agendamento.create(campos);
        return res.status(201).json(response);
    }

    async destroy(req, res) {
        const { agendamentoId } = req.params;
        
        if (!agendamentoId){
            return res.status(400).json({erro: 'Agendamento não informado.'});
        };

        try {
            await Agendamento.findByIdAndRemove(agendamentoId);
            return res.status(200).json({msg: "Agendamento excluído com sucesso"});
        } catch (error) {
            return res.status(400).json({
                erro: `Não foi possivel remover Agendamento. ${error}`
            });
        };
    }  
}

export default new AgendamentoController();