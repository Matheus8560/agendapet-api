const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servico = new Schema({
    titulo: {
        type: String,
        required: [true, 'Titulo é obrigatório']
    },
    descricao: String,
    valor: {
        type: Number,
        required: [true, 'Valor é obrigatório']
    },
    duracao: {
        type: Number,
        required: [true, 'Duração é obrigatório']
    },
});

module.exports = mongoose.model('Servico', servico);