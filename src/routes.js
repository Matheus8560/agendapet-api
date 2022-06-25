import { Router } from 'express';

import SessionController from './controllers/SessionController';
import UsuarioController from './controllers/UsuarioController';

const routes = new Router();

routes.get('/usuario', UsuarioController.index);
routes.post('/usuario', UsuarioController.create);
routes.put('/usuario/:usuarioId', UsuarioController.update);
routes.delete('/usuario/:usuarioId', UsuarioController.destroy);

export default routes;