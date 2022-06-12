const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const horario = new Schema({
    dia: {
        type: Number,
        required: true
    },
    inicio: {
        type: Number,
        required: true
    },
    fim: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Horario', horario);