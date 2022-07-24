import { Router } from 'express';

import SessionController from './controllers/SessionController';
import UsuarioController from './controllers/UsuarioController';
import ServicoController from './controllers/ServicoController';
import HorarioController from './controllers/HorarioController';
import AgendamentoController from './controllers/AgendamentoController';

const routes = new Router();

//rotas de usuários
routes.get('/usuario', UsuarioController.index);
routes.post('/usuario', UsuarioController.create);
routes.put('/usuario/:usuarioId', UsuarioController.update);
routes.delete('/usuario/:usuarioId', UsuarioController.destroy);

//rotas de serviços
routes.get('/servico', ServicoController.index);
routes.post('/servico', ServicoController.create);
routes.put('/servico/:servicoId', ServicoController.update);
routes.delete('/servico/:servicoId', ServicoController.destroy);

//rotas de horaros
routes.get('/horario', HorarioController.index);
routes.post('/horario', HorarioController.create);
routes.put('/horario/:horarioId', HorarioController.update);
routes.delete('/horario', HorarioController.destroy);

//rotas de agendamento
routes.get('/agendamento', AgendamentoController.index);
routes.get('/horarios-disponiveis', AgendamentoController.available);
routes.post('/agendamento', AgendamentoController.create);
routes.delete('/agendamento', AgendamentoController.destroy);

export default routes;