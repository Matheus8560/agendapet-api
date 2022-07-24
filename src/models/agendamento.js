const mongoose = require('mongoose');
const servico = require('./servico');
const Schema = mongoose.Schema;

const agendamento = new Schema({
    servicoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Servico',
        required: true
    },
    clienteId:  {
        type: mongoose.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    hora: Array,
    valor: Number
});

module.exports = mongoose.model('Agendamento', agendamento);