import Usuario from '../models/usuario'
class SessionController {

    async create(req, res) {
        return res.json({msg: 'minha api!'});
    }
    
}

export default new SessionController();