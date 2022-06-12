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
    duracao: Number,
});

module.exports = mongoose.model('Servico', servico);