import { Router } from 'express';

import authMiddleware from './middlewares/auth'

import SessionController from './controllers/SessionController';
import UsuarioController from './controllers/UsuarioController';
import ServicoController from './controllers/ServicoController';
import HorarioController from './controllers/HorarioController';
import AgendamentoController from './controllers/AgendamentoController';

const routes = new Router();

//rotas de altenticação e recuperação de senha
routes.post('/session', SessionController.create);
routes.post('/recovery', SessionController.recovery);
routes.get('/session/refresh', authMiddleware, SessionController.refresh);

//rotas de usuários 
//(Obs: A autenticação na criação do usuário está comentada para criação do primeiro usuario, descomente após cria-lo.)
routes.get('/usuario', authMiddleware, UsuarioController.index);
routes.post('/usuario', /*authMiddleware,*/ UsuarioController.create);
routes.put('/usuario/:usuarioId', authMiddleware, UsuarioController.update);
routes.delete('/usuario/:usuarioId', authMiddleware, UsuarioController.destroy);

//rotas de serviços
routes.get('/servico', authMiddleware, ServicoController.index);
routes.post('/servico', authMiddleware, ServicoController.create);
routes.put('/servico/:servicoId', authMiddleware, ServicoController.update);
routes.delete('/servico/:servicoId', authMiddleware, ServicoController.destroy);

//rotas de horaros
routes.get('/horario', authMiddleware, HorarioController.index);
routes.post('/horario', authMiddleware, HorarioController.create);
routes.put('/horario/:horarioId', authMiddleware, HorarioController.update);
routes.delete('/horario', authMiddleware, HorarioController.destroy);

//rotas de agendamento
routes.get('/agendamento', authMiddleware, AgendamentoController.index);
routes.get('/horarios-disponiveis', authMiddleware, AgendamentoController.available);
routes.post('/agendamento', authMiddleware, AgendamentoController.create);
routes.delete('/agendamento/:agendamentoId', authMiddleware, AgendamentoController.destroy);

export default routes;