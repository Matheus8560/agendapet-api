import { Router } from 'express';

import SessionController from './controllers/SessionController';
import UsuarioController from './controllers/UsuarioController';
import ServicoController from './controllers/ServicoController';

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

export default routes;