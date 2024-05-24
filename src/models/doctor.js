const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
    cedula: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);