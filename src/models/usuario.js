const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuario = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatório']
    },
    telefone: String,
    nivel: {
        type: String,
        default: '2'
    }
});

module.exports = mongoose.model('Usuario', usuario);